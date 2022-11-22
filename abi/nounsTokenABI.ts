const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "__descriptor",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "_descriptor",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "descriptor",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "nounId",
          "type": "uint256"
        }
      ],
      "name": "seeds",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint48",
              "name": "background",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "body",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "accessory",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "head",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "glasses",
              "type": "uint48"
            }
          ],
          "internalType": "struct INounsSeederLike.Seed",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint48",
              "name": "background",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "body",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "accessory",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "head",
              "type": "uint48"
            },
            {
              "internalType": "uint48",
              "name": "glasses",
              "type": "uint48"
            }
          ],
          "internalType": "struct INounsSeederLike.Seed",
          "name": "seed",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "nounId",
          "type": "uint256"
        }
      ],
      "name": "setSeed",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;
  export default abi;