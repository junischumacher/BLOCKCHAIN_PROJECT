

  const getAccount = (web3) => {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, accounts) => {
        if(typeof error === null) {
          return reject(error);
        } 
        
        resolve(accounts[9]); //////////////////////////////
        
      });
    });
  };

  

  const checkAccount = (todo) => {
    return new Promise((resolve, reject) => {
      todo.checkAccount((error, val) => {
        if(typeof error == null){
          return reject(error);
        }
        resolve(val);

      });
    });
  }

  // const getAccount = (todo, web3) => {
  //   return new Promise((resolve, reject) => {
  //     todo.getAccount((account) => {
        
  //         resolve(account); //////////////////////////////
  //     });
        
        
  //   });
   
  // };

  const userLogin = (web3, account, password) => {
    return new Promise((resolve, reject) => {
      web3.personal.unlockAccount(account, password, 600).then((response) => {
        console.log(response);
      }); 
      
    });
  }


  const getAllAccounts = (web3) => {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, accounts) => {
        if(typeof error == null) {
          return reject(error);
        }
        resolve(accounts);
      });
    });
  }
  
  const remove = (todo, account, index, price) => {
    return new Promise((resolve, reject)=>{
      console.log("-+-+-=-=-=--------------------=-=-=");
      todo.remove(account, index, {from: account, gas: 1000000}).then(()=>{
        console.log("hhahahahahahah");
      });
      
    });
  }

  const removeFromStore = (todo, index) => {
    return new Promise((resolve, reject)=>{
      console.log("-+-+-=-=-=--------------------=-=-=");
      todo.removeFromStore(index, {from: account, gas: 1000000}).then(()=>{
        console.log("hhahahahahahah remove from store");
      });
      
    });
  }

  const addCardToStore = (todo, account, price, index) => {
    return new Promise((resolve, reject)=>{
      
      
      todo.addCardToStore(account, price, index, {from: account, gas: 1000000}).then(()=>{});
      
      
  
      
    });
  }

  const payForCard = (todo, account, price) => {
    console.log("In pay for card");
    return new Promise((resolve, reject) => {
      todo.fund({from: account
        ,value:price, gas:1000000}).then(()=>{}); //1000000

    });
  } 

  const buyCardFromStore = (todo, account, index) => {
    console.log("in buy card from store");
    return new Promise((resolve, reject)=>{
      todo.buyCardFromStore(account, index, {from:account, gas: 1000000}).then(()=>{});
    });
  }
  
  const getIdNumber2 = (todo) =>{
    return new Promise((resolve, reject) => {
      todo.getIdNumber2((error, size) => {
        if(typeof error == null){
          return reject(error);
        }
        resolve(size);
      });
    });
  }

  const getCardNumber = (todo, account) => {
      return new Promise((resolve, reject) => {
        todo.getCardNumber(account).then((error, card_num) =>{
          if(typeof error == null){
            return reject(error);
          }
          resolve(card_num);
        });
      });
  }

  const payForSeller = (todo, id) => {
    return new Promise((resolve, reject) => {
      todo.payForSeller(id).then((val)=>{
        console.log('HAVE PAID FOR SELLER');
        console.log(val);
      });
    }).catch((error) => {
      reject(error);
    });
  }

  // 获取某个帐号的item的数量
  const getAccountItemNumber = (todo, addr) => {
    return new Promise((resolve, reject) => {
      todo.getAccountItemNumber((error, size) => {
        if(typeof error == null){
          return reject(error);
        }
        resolve(size);
      });
    });
  }

  const getStoreCardPrice = (todo, id, account) => {
    console.log("in get price");
    return new Promise((resolve, reject) => {
      //todo.getAccount().then((val) => {
       // console.log("action val: " + val); 
        //add = val;
        console.log("test getstorecardprice");
        
        todo.getStoreCardPrice(id).then((price) => {
          console.log("get price test the price " + price);
          todo.fund({from: account
            ,value:price, gas:1000000}).then(()=>{
              console.log("HAVE PAID")
            }); //1000000
          console.log("emmmmmmmmmmmmmmmmmmmmmmmmm");  
          resolve(price);
        }).catch((error) => {
          reject(error);
        });
    })
  }

  const getStoreCardColor = (todo, id) => {
    console.log("in get color");
    return new Promise((resolve, reject) => {
      //todo.getAccount().then((val) => {
       // console.log("action val: " + val); 
        //add = val;
      
        
        todo.getStoreCardColor(id).then((color) => {
         
          resolve(color);
        }).catch((error) => {
          reject(error);
        });
    })
  }



 
  const getPuzzle = (todo) => {
    return new Promise((resolve, reject) => {
      todo.getPuzzle((error, index) => {
        if(typeof error == null){
          return reject(error);
        }
        resolve(index);
      });
    });
  }

  const getSpecificPuzzleColor = (todo, account, index) => {
    return new Promise((resolve, reject) => {
      todo.getSpecificPuzzleColor(account, index).then((color) => {
        console.log("angry !color " + color);
        resolve(color);
      });
    });
  }

  
  

  const getTasks = (todo) => {
    return new Promise((resolve, reject) => {
        console.log("angry");
      todo.getTaskIds()
      .then((taskIds) => {
        const promises = [];
        taskIds.forEach((taskId) => {
          promises.push(todo.getTask(taskId));
        });
        return Promise.all(promises);
      })
      .then((tasks) => {
        resolve(tasks);
        console.log(tasks);
      })
      .catch((error) => {
        reject(error);
      });
    });
  };

 
    
  
  const getItemTasks = (todo, addr) => {
    return new Promise((resolve, reject) => {
      //todo.getAccount().then((val) => {
       // console.log("action val: " + val); 
        //add = val;
        console.log("action.js/getItemTasks");
        console.log("addr " + addr);
        todo.getAccountItemNumber(addr).then((size) => {
          console.log("action.js/getItemTasks/size " + size);
          
          const promises = [];


          // 闭包 循环
          for (var i = 0; i < size; i++) {

            (function(index) {
                console.log('iterator: ' + index);
                console.log("test action.js/getItemTasks/loop i " + i);
                console.log("hey " + todo.getItemTask(i, addr));
                promises.push(todo.getItemTask(i, addr));
                //now you can also loop an ajax call here 
                //without losing track of the iterator value: $.ajax({});
            })(i);

          }
        
          return Promise.all(promises);
    
        }).then((tasks) => {
          resolve(tasks);
          console.log(tasks);
        })
        .catch((error) => {
          reject(error);
        });
  })
     
  }
  //////////////////////////////////////////////////////////////////////////////////////





  

  export {
    getAccount, getTasks, getAllAccounts,  getIdNumber2, getAccountItemNumber, getItemTasks, userLogin, checkAccount, getPuzzle, remove, getCardNumber, addCardToStore, getSpecificPuzzleColor, buyCardFromStore, payForCard, getStoreCardPrice, payForSeller, removeFromStore, getStoreCardColor
  }