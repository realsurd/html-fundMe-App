import { ethers } from "./ethers-5.7.esm.min.js"
import { abi, contractAddress } from "./constants.js"

// give functions to the buttons
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw


//  How to connect my html to metamask
        // 1. Check to see if window.ethereum exists
        async function connect () {
            if (typeof window.ethereum !== "undefined") {
               await window.ethereum.request({method: "eth_requestAccounts"})
               connectButton.innerHTML = "Connected!"
            } else {
                connectButton.innerHTML = "Please install metamask!"
            }
        }

        // get balance function
        async function getBalance() {
            if(typeof window.ethereum != "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const balance = await provider.getBalance(contractAddress)
                console.log(ethers.utils.formatEther(balance))
            }
        }

        // fund function
            async function fund() {
                const ethAmount = document.getElementById("ethAmount").value
                console.log(`Funding with ${ethAmount}...`)
                if (typeof window.ethereum !== "undefined") {
                    // what we need to fund an account
                    // provider / connection to the blockchain
                    // signer / wallet / someone with some gas
                    // contract that we are interracting with
                    // ABI & Address
                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    const signer = provider.getSigner()
                    const contract = new ethers.Contract(contractAddress, abi, signer) // to get your contract opne a new constants.js file
                    try {
                        const transactionResponse = await contract.fund({ 
                            value: ethers.utils.parseEther(ethAmount),
                        })      
                        await listenForTransactioinMine(transactionResponse, provider)
                        console.log("Done!")
                    } catch (error) {
                        console.log(error)
                    }       
            }

            function listenForTransactioinMine(transactionResponse, provider) {
                console.log(`Mining ${transactionResponse.hash}...`)
                return new Promise((resolve, reject) => {
                    provider.once(transactionResponse.hash, (transactionReceipt) => {
                        console.log(
                            `Completed with ${transactionReceipt.confirmations} confirmations`
                            )
                            resolve()
                    })
                })
               
            }
        }

        // withdraw 
        async function withdraw() {
            console.log(`Withdrawing...`)
            if (typeof window.ethereum !== "undefined") {
              const provider = new ethers.providers.Web3Provider(window.ethereum)
              await provider.send('eth_requestAccounts', [])
              const signer = provider.getSigner()
              const contract = new ethers.Contract(contractAddress, abi, signer)
              try {
                const transactionResponse = await contract.withdraw()
                await listenForTransactionMine(transactionResponse, provider)
                // await transactionResponse.wait(1)
              } catch (error) {
                console.log(error)
              }
            } else {
              withdrawButton.innerHTML = "Please install MetaMask"
            }
          }