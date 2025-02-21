/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/decentralized_estate_management_system.json`.
 */
export type DecentralizedEstateManagementSystem = {
	"address": "7aYAi7dRUXcBoaXA9SHD99akAmPKwVfCJSevF9Ch3L8b",
	"metadata": {
	  "name": "decentralizedEstateManagementSystem",
	  "version": "0.1.0",
	  "spec": "0.1.0",
	  "description": "Created with Anchor"
	},
	"instructions": [
	  {
		"name": "addResident",
		"discriminator": [
		  203,
		  87,
		  252,
		  226,
		  231,
		  24,
		  124,
		  105
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "estate",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					101,
					115,
					116,
					97,
					116,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate.name",
				  "account": "estateState"
				}
			  ]
			}
		  },
		  {
			"name": "resident",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					114,
					101,
					115,
					105,
					100,
					101,
					110,
					116
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				},
				{
				  "kind": "account",
				  "path": "user"
				}
			  ]
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": []
	  },
	  {
		"name": "createPoll",
		"discriminator": [
		  182,
		  171,
		  112,
		  238,
		  6,
		  219,
		  14,
		  110
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "estate",
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					101,
					115,
					116,
					97,
					116,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate.name",
				  "account": "estateState"
				}
			  ]
			}
		  },
		  {
			"name": "poll",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					112,
					111,
					108,
					108
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				},
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "arg",
				  "path": "description"
				}
			  ]
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": [
		  {
			"name": "description",
			"type": "string"
		  },
		  {
			"name": "amount",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "initialize",
		"discriminator": [
		  175,
		  175,
		  109,
		  31,
		  13,
		  152,
		  155,
		  237
		],
		"accounts": [
		  {
			"name": "leader",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "estate",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					101,
					115,
					116,
					97,
					116,
					101
				  ]
				},
				{
				  "kind": "arg",
				  "path": "name"
				}
			  ]
			}
		  },
		  {
			"name": "resident",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					114,
					101,
					115,
					105,
					100,
					101,
					110,
					116
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				},
				{
				  "kind": "account",
				  "path": "leader"
				}
			  ]
			}
		  },
		  {
			"name": "vault",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					118,
					97,
					117,
					108,
					116
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				}
			  ]
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": [
		  {
			"name": "name",
			"type": "string"
		  }
		]
	  },
	  {
		"name": "makeDeposit",
		"discriminator": [
		  156,
		  193,
		  142,
		  79,
		  192,
		  68,
		  10,
		  64
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true,
			"relations": [
			  "resident"
			]
		  },
		  {
			"name": "estate",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					101,
					115,
					116,
					97,
					116,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate.name",
				  "account": "estateState"
				}
			  ]
			}
		  },
		  {
			"name": "vault",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					118,
					97,
					117,
					108,
					116
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				}
			  ]
			}
		  },
		  {
			"name": "transaction",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					116,
					114,
					97,
					110,
					115,
					97,
					99,
					116,
					105,
					111,
					110
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				},
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "arg",
				  "path": "seed"
				}
			  ]
			}
		  },
		  {
			"name": "resident",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					114,
					101,
					115,
					105,
					100,
					101,
					110,
					116
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				},
				{
				  "kind": "account",
				  "path": "user"
				}
			  ]
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": [
		  {
			"name": "seed",
			"type": "u64"
		  },
		  {
			"name": "amount",
			"type": "u64"
		  }
		]
	  },
	  {
		"name": "vote",
		"discriminator": [
		  227,
		  110,
		  155,
		  23,
		  136,
		  126,
		  172,
		  25
		],
		"accounts": [
		  {
			"name": "user",
			"writable": true,
			"signer": true
		  },
		  {
			"name": "pollCreator",
			"writable": true
		  },
		  {
			"name": "estate",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					101,
					115,
					116,
					97,
					116,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate.name",
				  "account": "estateState"
				}
			  ]
			}
		  },
		  {
			"name": "vote",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					118,
					111,
					116,
					101
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				},
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "account",
				  "path": "poll"
				}
			  ]
			}
		  },
		  {
			"name": "poll",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					112,
					111,
					108,
					108
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				},
				{
				  "kind": "account",
				  "path": "poll.creator",
				  "account": "pollState"
				},
				{
				  "kind": "account",
				  "path": "poll.description",
				  "account": "pollState"
				}
			  ]
			}
		  },
		  {
			"name": "transaction",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					116,
					114,
					97,
					110,
					115,
					97,
					99,
					116,
					105,
					111,
					110
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				},
				{
				  "kind": "account",
				  "path": "user"
				},
				{
				  "kind": "arg",
				  "path": "seed"
				}
			  ]
			}
		  },
		  {
			"name": "vault",
			"writable": true,
			"pda": {
			  "seeds": [
				{
				  "kind": "const",
				  "value": [
					118,
					97,
					117,
					108,
					116
				  ]
				},
				{
				  "kind": "account",
				  "path": "estate"
				}
			  ]
			}
		  },
		  {
			"name": "systemProgram",
			"address": "11111111111111111111111111111111"
		  }
		],
		"args": [
		  {
			"name": "seed",
			"type": "u64"
		  },
		  {
			"name": "vote",
			"type": "bool"
		  }
		]
	  }
	],
	"accounts": [
	  {
		"name": "estateState",
		"discriminator": [
		  60,
		  151,
		  197,
		  1,
		  85,
		  225,
		  236,
		  29
		]
	  },
	  {
		"name": "pollState",
		"discriminator": [
		  109,
		  152,
		  26,
		  106,
		  129,
		  229,
		  220,
		  192
		]
	  },
	  {
		"name": "residentState",
		"discriminator": [
		  252,
		  143,
		  157,
		  93,
		  201,
		  161,
		  36,
		  17
		]
	  },
	  {
		"name": "transactionState",
		"discriminator": [
		  176,
		  18,
		  251,
		  145,
		  28,
		  53,
		  98,
		  100
		]
	  },
	  {
		"name": "voteState",
		"discriminator": [
		  100,
		  177,
		  100,
		  106,
		  158,
		  188,
		  195,
		  137
		]
	  }
	],
	"errors": [
	  {
		"code": 6000,
		"name": "nameTooLong",
		"msg": "name too long"
	  },
	  {
		"code": 6001,
		"name": "invalidName",
		"msg": "name should not be empty"
	  },
	  {
		"code": 6002,
		"name": "descriptionTooLong",
		"msg": "description is too long"
	  },
	  {
		"code": 6003,
		"name": "invalidDescription",
		"msg": "description should not be empty"
	  },
	  {
		"code": 6004,
		"name": "invalidAmount",
		"msg": "Amount is invalid"
	  },
	  {
		"code": 6005,
		"name": "exceededBalance",
		"msg": "Amount exceeds vault balance"
	  },
	  {
		"code": 6006,
		"name": "alreadyVoted",
		"msg": "user already voted"
	  },
	  {
		"code": 6007,
		"name": "pollClose",
		"msg": "Poll is close"
	  }
	],
	"types": [
	  {
		"name": "estateState",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "leader",
			  "type": "pubkey"
			},
			{
			  "name": "bump",
			  "type": "u8"
			},
			{
			  "name": "vaultBump",
			  "type": "u8"
			},
			{
			  "name": "noOfResidents",
			  "type": "u32"
			},
			{
			  "name": "vaultBalance",
			  "type": "u64"
			},
			{
			  "name": "name",
			  "type": "string"
			}
		  ]
		}
	  },
	  {
		"name": "pollState",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "creator",
			  "type": "pubkey"
			},
			{
			  "name": "estate",
			  "type": "pubkey"
			},
			{
			  "name": "bump",
			  "type": "u8"
			},
			{
			  "name": "active",
			  "type": "bool"
			},
			{
			  "name": "amount",
			  "type": "u64"
			},
			{
			  "name": "agreeVotes",
			  "type": "u64"
			},
			{
			  "name": "disagreeVotes",
			  "type": "u64"
			},
			{
			  "name": "description",
			  "type": "string"
			}
		  ]
		}
	  },
	  {
		"name": "residentState",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "user",
			  "type": "pubkey"
			},
			{
			  "name": "estate",
			  "type": "pubkey"
			},
			{
			  "name": "bump",
			  "type": "u8"
			},
			{
			  "name": "totalContributed",
			  "type": "u64"
			}
		  ]
		}
	  },
	  {
		"name": "transactionState",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "estate",
			  "type": "pubkey"
			},
			{
			  "name": "bump",
			  "type": "u8"
			},
			{
			  "name": "timestamp",
			  "type": "i64"
			},
			{
			  "name": "isDeposit",
			  "type": "bool"
			},
			{
			  "name": "amount",
			  "type": "u64"
			},
			{
			  "name": "from",
			  "type": "pubkey"
			},
			{
			  "name": "to",
			  "type": "pubkey"
			}
		  ]
		}
	  },
	  {
		"name": "voteState",
		"type": {
		  "kind": "struct",
		  "fields": [
			{
			  "name": "vote",
			  "type": "bool"
			},
			{
			  "name": "poll",
			  "type": "pubkey"
			},
			{
			  "name": "voter",
			  "type": "pubkey"
			},
			{
			  "name": "bump",
			  "type": "u8"
			},
			{
			  "name": "isInitialized",
			  "type": "bool"
			}
		  ]
		}
	  }
	]
  };
  