<template>
  <div>
    <w3m-core-button label="Login"></w3m-core-button>
    <div v-if="accountAddress">
      {{ renderedAccountAddress }}
      <div class="btn" @click="sign">sign</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createClient, signMessage } from '@wagmi/core'
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains'
import { watchAccount } from '@wagmi/core'
import { computed, ref } from 'vue'
const chains = [arbitrum, mainnet, polygon]

// Wagmi Core Client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: '7f2678536a5b6b5643d94a6428e341a1' })
])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: '7f2678536a5b6b5643d94a6428e341a1',
    version: '1', // or "2"
    appName: 'web3Modal',
    chains
  }),
  provider
})

// Web3Modal and Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)
const web3modal = new Web3Modal(
  {
    projectId: '7f2678536a5b6b5643d94a6428e341a1',
    themeColor: 'orange',
    themeBackground: 'themeColor',
    enableAccountView: false
  },
  ethereumClient
)
console.log(web3modal)
// const unsubscribe = web3modal.subscribeModal((newState) =>
// console.log(newState)
// );
const accountAddress = ref('')
watchAccount((account) => {
  if (account.address) {
    console.log('account changed', account.address)
    accountAddress.value = account.address
  } else {
    accountAddress.value = ''
    console.log('account disconnected')
  }
})
const sign = async () => {
  const signature = await signMessage({
    message: 'pog wants authorisation'
  })
  console.log(signature)
}
const renderedAccountAddress = computed(() => {
  return accountAddress.value.slice(0, 4) + '...' + accountAddress.value.slice(-4)
})
</script>

<style lang="scss" scoped></style>
