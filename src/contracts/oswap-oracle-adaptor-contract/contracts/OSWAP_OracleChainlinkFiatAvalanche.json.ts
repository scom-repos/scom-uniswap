export default {
"abi":[
{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"chainlinkDeicmals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"payload","type":"bytes"}],"name":"getLatestPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"fromAmount","type":"uint256"},{"internalType":"uint256","name":"toAmount","type":"uint256"},{"internalType":"bytes","name":"payload","type":"bytes"}],"name":"getRatio","outputs":[{"internalType":"uint256","name":"numerator","type":"uint256"},{"internalType":"uint256","name":"denominator","type":"uint256"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"}],"name":"isSupported","outputs":[{"internalType":"bool","name":"supported","type":"bool"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"priceFeedAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
],
"bytecode":"60a06040526001805460ff1916601217905534801561001d57600080fd5b50600060808190526001805460ff1916600817905560208190527f79fd1ef75575a29e2c840558d827344cc47cec641087891470308266c284da3b80546001600160a01b0319908116730a77230d17318075983913bc2145db16c7366156179091557fa3ea82ff9a2a2dea405d5ebf8cd675a399cee236a6f055c1cf120f6748ce7fc380548216733ca13391e9fb38a75330fb28f8cc2eb3d9ceceed1790557f373151a282a02717273407eb7168bf6623e938ecd7fbe695017d371e7454e8d380548216737b0ca9a6d03fe0467a31ca850f5bca51e027b3af1790557f7e21e268b83b0d38f4506902f672d5e4bb9de408ca86d51361b302dedeef9ba38054821673cf667fb6bd30c520a435391c50cadcde15e5e12f1790557f1711930d8bbdd8e149c8ff0c14773489a4d9edd99f94f6b10b658b355fd4296680548216732779d32d5166baaa2b2b658333ba7e6ec0c657431790557f964186a4f018f9bbf425565eb85229d379f7f74690bc2fb38845f35f4b391ba48054821673827f8a0dc5c943f7524dda178e2e7f275aad743f1790557f5168043d85dd693fa85d213a5a3e1191de7379a93c3c6faae63171fb25d4db0e805482167351d7180eda2260cc4f6e4eebb82fef5c3c2b83001790557f665f651fefaf898a9996193237048d99b729eb21ced6b718b8f63cb9876643e88054821673976b3d034e162d8bd72d6b9c989d545b839003b01790557f43539ee40990dbc7a65038990eae613c0bd27274c87d035c5ff0bc0024ec0274805482167302d35d3a8ac3e1626d3ee09a78dd87286f5e8e3a1790557f951fa861d9c02224753135ae19f551f2865146d0135125614a8d593ad9a0443d805482167349ccd9ca821efeab2b98c60dc60f518e765ede9a1790557feaaee89570bde102f9cc338ff3f268f8c88500107e504ea0a04705de854e3e61805482167354edab30a7134a16a54218ae64c73e1daf48a8fb1790557fabb1e936bb87bfa1d84b9c1c678fa8e563d6efbcce6d5e9a8cce38c7fdd71ef3805482167336e039e6391a5e7a7267650979fdf613f659be5d1790557f7e41785f243713a37b91649dc9e39a7a188c7bfebb11028eac268e731ace34e280548216734f3ddf9378a4865cf4f28be51e10aecb83b7daee1790557f673ba1588be7b5a3031e1c0ae9af305ac1d01822e8098702cb164c1f8290ff848054821673449a373a090d8a1e5f74c63ef831ceff39e945631790557ff9b18f5e259e3fcbc76d1debd318aeef7f299521863965dee016d394942de23c80548216739cf3ef104a973b351b2c032aa6793c3a6f76b4481790557ff0e3e484c42ef2c28c6fecc1bd94e8072964e12237740339d2701cb26f66ef7980548216739a1372f9b1b71b3a5a72e092ae67e172dbd7daaa1790557f7c05e54549734c08163f21c8ab18f6dd9d326ae6776512d46701947006feb2188054821673f096872672f44d6eba71458d74fe67f9a77a23b91790557fc6fb082ed5616bb1a7fe7134cbc1be278693166a9d49cf450eb11e238e9f21a08054821673ebe676ee90fe1112671f19b6b7459bc678b67e8a17905573260bbf5698121eb85e7a74f2e45e16ce762ebe119091527f20b0d961307cc54612e48f4375a0fc2f64ad8ea6cb89d00da458ce1d53f8af6a805490911673f58b78581c480caff667c63fedd564ecf01ef86b17905560805160601c610ccd6105136000398061039b528061053c52806105c0528061072e52806107c75250610ccd6000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806388462c8d1161005b57806388462c8d146101a45780638e9e56ef146101f3578063ad5c4648146101fb578063d9da4fe6146102035761007d565b8063313ce56714610082578063495e4348146100a057806375aa417414610148575b600080fd5b61008a6102be565b6040805160ff9092168252519081900360200190f35b610136600480360360608110156100b657600080fd5b73ffffffffffffffffffffffffffffffffffffffff82358116926020810135909116918101906060810160408201356401000000008111156100f757600080fd5b82018360208201111561010957600080fd5b8035906020019184600183028401116401000000008311171561012b57600080fd5b5090925090506102c3565b60408051918252519081900360200190f35b61017b6004803603602081101561015e57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661030f565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101df600480360360408110156101ba57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516610337565b604080519115158252519081900360200190f35b61008a610390565b61017b610399565b6102a5600480360360a081101561021957600080fd5b73ffffffffffffffffffffffffffffffffffffffff823581169260208101359091169160408201359160608101359181019060a08101608082013564010000000081111561026657600080fd5b82018360208201111561027857600080fd5b8035906020019184600183028401116401000000008311171561029a57600080fd5b5090925090506103bd565b6040805192835260208301919091528051918290030190f35b601290565b60008060006102d7878760008089896103bd565b9092509050610304816102f884670de0b6b3a764000063ffffffff61048316565b9063ffffffff6104f616565b979650505050505050565b60006020819052908152604090205473ffffffffffffffffffffffffffffffffffffffff1681565b600073ffffffffffffffffffffffffffffffffffffffff83161580610370575073ffffffffffffffffffffffffffffffffffffffff8216155b1561037d5750600061038a565b6103878383610538565b90505b92915050565b60015460ff1681565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008073ffffffffffffffffffffffffffffffffffffffff8816158015906103fa575073ffffffffffffffffffffffffffffffffffffffff871615155b61046557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601e60248201527f4f535741503a204f7261636c653a20496e76616c696420616464726573730000604482015290519081900360640190fd5b6104738888888888886106a4565b915091505b965096945050505050565b6000826104925750600061038a565b8282028284828161049f57fe5b0414610387576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526021815260200180610c4a6021913960400191505060405180910390fd5b600061038783836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f00000000000081525061094c565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156105be575073ffffffffffffffffffffffffffffffffffffffff80821660009081526020819052604090205416151561038a565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610642575073ffffffffffffffffffffffffffffffffffffffff80831660009081526020819052604090205416151561038a565b73ffffffffffffffffffffffffffffffffffffffff8084166000908152602081905260408082205485841683529120549082169116811580159061069b575073ffffffffffffffffffffffffffffffffffffffff811615155b95945050505050565b6000808673ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff16141561072c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526029815260200180610c216029913960400191505060405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff1614156107c55773ffffffffffffffffffffffffffffffffffffffff8088166000908152602081905260408120549091166107b381610a08565b60ff16600a0a94509250610478915050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff16141561085f5773ffffffffffffffffffffffffffffffffffffffff80891660009081526020819052604081205490911661084c81610a08565b90945060ff16600a0a9250610478915050565b73ffffffffffffffffffffffffffffffffffffffff8089166000908152602081905260408120549091169061089382610a08565b73ffffffffffffffffffffffffffffffffffffffff808c1660009081526020819052604081205493975091935091909116906108ce82610a08565b909550905060ff80841690821611156109115761090a6108fa60ff83811690861663ffffffff610b6f16565b8790600a0a63ffffffff61048316565b955061093d565b61093a61092a60ff85811690841663ffffffff610b6f16565b8690600a0a63ffffffff61048316565b94505b50505050965096945050505050565b600081836109f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b838110156109b757818101518382015260200161099f565b50505050905090810190601f1680156109e45780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b5060008385816109fe57fe5b0495945050505050565b60008073ffffffffffffffffffffffffffffffffffffffff8316610a8d57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f4f535741503a2070726963652066656564206e6f7420666f756e640000000000604482015290519081900360640190fd5b60008373ffffffffffffffffffffffffffffffffffffffff1663feaf968c6040518163ffffffff1660e01b815260040160a06040518083038186803b158015610ad557600080fd5b505afa158015610ae9573d6000803e3d6000fd5b505050506040513d60a0811015610aff57600080fd5b506020015160015460ff169250905060008113610b67576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602d815260200180610c6b602d913960400191505060405180910390fd5b939092509050565b600061038783836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525060008184841115610c18576040517f08c379a00000000000000000000000000000000000000000000000000000000081526020600482018181528351602484015283519092839260449091019190850190808383600083156109b757818101518382015260200161099f565b50505090039056fe4f535741503a2066726f6d20616e6420746f2061646472657373657320617265207468652073616d65536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f774f535741505f4f7261636c65436861696e6c696e6b3a204e65676174697665206f72207a65726f207072696365a26469706673582212207e28c9eef85edf487141aac8a059849f823840a82213ff0589ea8a162d5c732864736f6c634300060b0033"
}