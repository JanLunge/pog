import { ref } from "vue";
import JSON5 from "json5";
import {keycount, keymap, selectedConfig, selectedKeys} from "../store";
export const matrixPositionToIndex = ({
  pos,
  matrixSize,
}: {
  pos: number[];
  matrixSize: Number[];
}) => {
  const matrixWidth = Number(matrixSize[1]);
  return Number(pos[0]) * matrixWidth + Number(pos[1]);
};

const formatMatrixFromLabel = (label: string): number[] | false => {
  const matrix = label.split(",").map((a) => Number(a));
  if (matrix.length !== 2) return false;
  return matrix;
};

export const cleanupKeymap = () => {
  if (!selectedConfig.value) return;
  if (!selectedConfig.value.currentKeymap) {
    selectedConfig.value.currentKeymap = [[]];
  }
  if (selectedConfig.value.currentKeymap.length === 0) {
    selectedConfig.value.currentKeymap = [[]];
  }
  if (!Array.isArray(keymap.value)) keymap.value = [];
  const filledKeymap = keymap.value.map((layer: any[]) => {
    // replace empty keys with KC.TRNS
    const tmpLayer = layer.map((key: string | undefined) => {
      if (!key) return "KC.TRNS";
      return key;
    });

    if (!selectedConfig.value) return;
    const matrixWidth = selectedConfig.value.matrix.cols;
    const matrixHeight = selectedConfig.value.matrix.rows;
    const matrixKeyCount = matrixHeight * matrixWidth;
    if (matrixKeyCount > tmpLayer.length) {
      while (matrixKeyCount > tmpLayer.length) {
        tmpLayer.push("KC.TRNS");
      }
    } else if (matrixKeyCount < tmpLayer.length) {
      while (matrixKeyCount < tmpLayer.length) {
        tmpLayer.pop();
      }
    }
    if (tmpLayer) return tmpLayer;
    return [];
  });
  if (filledKeymap) keymap.value = filledKeymap;
  console.log('set new keymap to ', filledKeymap)
};

const pickKeyAttributes = ({
  w,
  w2,
  h,
  h2,
  x,
  x2,
  y,
  y2,
}: {
  w: number;
  w2: number;
  h: number;
  h2: number;
  x: number;
  x2: number;
  y: number;
  y2: number;
}) => ({
  w,
  w2,
  h,
  h2,
  x,
  x2,
  y,
  y2,
});
// convert a kle keymap to pog
export const KleToPog = (kleString: string) => {
  let keymap = [];
  try {
    keymap = JSON5.parse(kleString);
  } catch (e) {
    console.log(e);
    try {
      keymap = JSON5.parse("[" + kleString + "]");
    } catch (e) {
      console.log(e);
    }
  }

  // parse Layout file
  const configContents: {
    layouts: { keymap: string[][]; labels: string[] | string[][] };
  } = {
    layouts: { keymap, labels: [] },
  };
  const keyboardInfo = ref<{
    keys: KeyData[];
  }>({ keys: [] });

  // in place update kle to pog layout => iterate over rows
  let currentX = 0;
  let currentY = 0;
  let keydata: any = undefined; // data to carry over to the next key until it is overwritten
  let firstKeyInRow = true;
  configContents.layouts.keymap.forEach((row) => {
    if (Array.isArray(row)) {
      // normal row
      row.forEach((keyOrData) => {
        // tmp key info
        let key: KeyData = { x: NaN, y: NaN };
        if (typeof keyOrData === "string") {
          // this is a key
          const labels = keyOrData.split("\n");
          if (labels.length === 1) {
            // just the main label
            // labels = ["", "", "", "", "", "", "", "", "", keyOrData];
            // key.matrixPos = keyOrData;
            const matrix = formatMatrixFromLabel(keyOrData);
            if (matrix) key.matrix = matrix;
          } else if (labels.length === 4) {
            // shortened labels top left and bottom right
            // labels = [keyOrData];
            // key.matrixPos = labels[0];
            const matrix = formatMatrixFromLabel(labels[0]);
            if (matrix) key.matrix = matrix;
            key.variant = labels[3].split(",").map((a) => Number(a));
          } else {
            // all labels just keep split
            // key.matrixPos = keyOrData[0];
            const matrix = formatMatrixFromLabel(keyOrData[0]);
            if (matrix) key.matrix = matrix;
            // key.variant = keyOrData[3]
          }
          // key.labels = labels;
          // Position data
          if (keydata) {
            key = { ...key, ...pickKeyAttributes(keydata) };
            if (keydata.y) currentY = keydata.y;
            if (keydata.x) currentX = keydata.x + currentX;
            if (firstKeyInRow) {
              key.x = currentX;
              firstKeyInRow = false;
            } else {
              key.x = currentX;
            }
          }
          if (!key.y) key.y = currentY;
          if (!key.x) key.x = currentX;
          keydata = undefined;
          if (!key.w || key.w === 1) {
            currentX++;
          } else {
            currentX = currentX + key.w;
          }
          keyboardInfo.value.keys.push(key);
        } else {
          // this is just data for the next key
          keydata = keyOrData;
        }
        // add 1 to left distance // next key
      });
      // add 1 to top distance // next row
      currentX = 0;
      firstKeyInRow = true;
      currentY++;
    }
  });
  console.log("created layout", keyboardInfo.value);
  return keyboardInfo.value.keys;
};

export const selectNextKey = () => {
  selectedKeys.value = new Set([
    Math.min([...selectedKeys.value][0] + 1, keycount.value - 1),
  ]);
}
export const selectPrevKey = () => {
  selectedKeys.value = new Set([
    Math.max([...selectedKeys.value][0] - 1, 0),
  ]);
}
