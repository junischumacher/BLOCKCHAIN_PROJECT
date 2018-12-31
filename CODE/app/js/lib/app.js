import $ from 'jquery'; 
import Web3 from 'web3'; 
import TruffleContract from 'truffle-contract'; 
import artifact from '../../../contracts/ToDo.sol'; 
import { renderTasks } from './render';
import { getAccount, getTasks, getAllAccounts, getIdNumber2, getAccountItemNumber, getItemTasks, userLogin, checkAccount, getPuzzle, remove, getCardNumber, addCardToStore, getSpecificPuzzleColor, buyCardFromStore, payForCard, getStoreCardPrice, payForSeller, removeFromStore, getStoreCardColor} from './actions';

var colors = ["red", "green", "blue", "yellow", "black"];

class App { 
  constructor(config) { 
    this.config = config; 
  }

  setup() { 
    
    // puzzle part
    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            
            if (date > 30) {
                break;
            }

            else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }


        }
        

        tbl.appendChild(row); // appending each row into calendar body.
    }




    console.log("hello");
    const { ethereumUrl } = this.config; 
    const web3 = new Web3(new Web3.providers.HttpProvider(ethereumUrl));
    
    const Todo = new TruffleContract(artifact);
    Todo.setProvider(web3.currentProvider);

    const networks = Object.keys(artifact.networks);
    const network = networks[networks.length - 1];
    const address = artifact.networks[network].address;


    this.web3 = web3;
    
    this.address = address;
    this.Todo = Todo;

    this.$login = $('#log-in');
    this.$account = $('#account');
    this.$password = $('#password');

    this.$tasks = $('#tasks');
    this.$newTask = $('#new-task'); 
    this.$taskContent = $('#task-content'); 
    this.$taskAuthor = $('#task-author');

    this.$loginShow = $('#loginShow');
    this.$createShow = $('#createShow');
    this.$listShow = $('#listShow');
    this.$shopShow = $('#shopShow');
    this.$myCollectionShow = $('#myCollectionShow');

    this.loginShowFlag = true;
    this.createShowFlag = false;
    this.listShowFlag = false;
    this.shopShowFlag = false;

    this.puzzleIndex = 0;

    // init
    // only show login
    $('#loginSection').show();
    $('#createSection').hide();
    $('#listSection').hide();
    $('#store').hide();
    $('#myCollection').hide();
    
    


    return new Promise((resolve, reject) => {
        getAccount(this.web3)    // this.web3 
       .then((account) => {
         this.account = account;
        
        console.log(this.account);////////////////
        return Todo.at(address);
      })
      .then((todo) => {  // todo是Todo的一个instance
        this.todo = todo;
        this.todo.getAccount().then((val) => {console.log("set up account val: " + val); this.account = val;});
     
        console.log("yes");
    
        resolve(todo);
        //return todo;
        

      })//.then((todo) => { getIdNumber2(todo).then((size) => {console.log(size);})})

      .catch((error) => {
        reject(error);
      });
    });
  }

 

  init() {

    // 
    // $(document).on('dblclick', '#an_tnam tr', { extra : 'random string' }, function(event)
    // {
    //     var data = event.data;

    //     // Prints 'random string' to the console
    //     console.log(data.extra);
    // }
    
    
    // this.todo.getAccount().then((account)=>{
    //   $(document).on('click', ".sell_button", { extra : account }, function(event){
    //     alert("sell button click");  
    //     var data = event.data;
    //     var index_to_remove = $(this).parent().index();
    //     console.log(data.extra);
    //     console.log('index to remove ' + index_to_remove);  
    //     console.log('index to remove2 ' + index_to_remove);  
          
    //   });
    // })

    

    this.todo.test().then((val)=>{console.log(val);});

    // RENDER THE STORE
    // WE JUST NEED TO INITIALIZE AT THE FIRST TIME
    // DON'T NEED TO RELOAD IT EVERY TIME WE LOG IN
    this.todo.getStoreCardInfo().then((card_size) => {
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
      console.log('card size ' + card_size/1);
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
      // FIRST CLEAR
      $('#store-items').empty();
      // ADD
      for(let i = 0; i < card_size; i++) {

        getStoreCardColor(this.todo, i).then((color)=>{
          console.log('color!!! ' + color);
          var name = "img/";
          name = name + color + ".jpg";
          $('<div class="col-10 col-sm-6 col-lg-4 mx-auto my-3 store-item sweets" data-item="sweets">\
        <div class="card ">\
            <div class="img-container">\
            <img src=' + name + ' class="card-img-top store-img" alt="">\
            <span class="store-item-icon">\
                <i class="fas fa-shopping-cart"></i>\
            </span>\
            </div>\
            <div class="card-body">\
            <div class="card-text d-flex justify-content-between text-capitalize">\
                <h5 id="store-item-name">sweet item</h5>\
                <h5 class="store-item-value">$ <strong id="store-item-price" class="font-weight-bold">5</strong></h5>\
            </div>\
            </div>\
        </div>\
        <button class="buy_button">BUY</button>\
        <!-- end of card-->\
        </div>').appendTo('#store-items');
        });
        
        

      }
    });


    //this.todo.getAccount().then((val) => {console.log("account val: " + val);});
    

    // show or hide the login section
    this.$loginShow.click(function(){
      // this.loginShowFlag = !this.loginShowFlag;
      // console.log('loginshowflag ' +  this.loginShowFlag);
      // if(this.loginShowFlag) {
      //   $("#loginSection").show();
      // }
      // else {
      //   $("#loginSection").hide();
      // }
      $('#loginSection').show();
      $('#createSection').hide();
      $('#listSection').hide();
      $('#store').hide();
      $('#myCollection').hide();
      

      
      
    });

    this.$createShow.click(function() {
      $('#loginSection').hide();
      $('#createSection').show();
      $('#listSection').hide();
      $('#store').hide();
      $('#myCollection').hide();
    });

    this.$listShow.click(() => {
      // RERENDER THE LIST
      this.todo.getAccount().then((val) => {
        getItemTasks(this.todo, val)
        .then((tasks) => {
          console.log("kkkkali");
          console.log(tasks[0]);
          console.log("in item task promise " + this.account);
          renderTasks(this.$tasks, tasks);
        });

      });

      $('#loginSection').hide();
      $('#createSection').hide();
      $('#listSection').show();
      $('#store').hide();
      $('#myCollection').hide();
      
      
          
      console.log('--------------TEST-------------------');
      
      //tbl.rows[row_index].cells[col_index].style.backgroundColor = "#003366";
      console.log('---------------------------------');
      
    });

    // show or hide the shop section
    this.$shopShow.click(()=> {
      // this.shopShowFlag = !this.shopShowFlag;
      // if(this.shopShowFlag) {
      //   $('#store').show();
      // }
      // else {
      //   $('#store').hide();
      // }
      $('#loginSection').hide();
      $('#createSection').hide();
      $('#listSection').hide();
      $('#store').show();
      $('#myCollection').hide();

      // check store
      this.todo.getStoreCardNumber().then((size) => {
        console.log("CARD NUM " + size/1);
      });


      // BUY OPERATION
      $(document).off('click', '.buy_button');
      $(document).on('click', ".buy_button", { extra : this.account, todo_instance: this.todo }, function(event){
        alert("buy button click");  
        var data = event.data;
        var todo_copy = data.todo_instance;
        var index_to_remove = $(this).parent().index();
        console.log(data.extra); // test now account
        console.log('index to remove ' + index_to_remove);  
        console.log('index to remove2 ' + index_to_remove);
        console.log(todo_copy);
        
        
       
        var r = confirm("Press a button!");
        if (r == true) {
          console.log("You pressed OK!");
          // get card from store
          buyCardFromStore(todo_copy, data.extra, index_to_remove).then(()=>{});

          // decrease the user's money
          getStoreCardPrice(todo_copy, index_to_remove, data.extra).then((price)=>{
             
          });

          // add money to the seller's account
          payForSeller(todo_copy, index_to_remove).then(()=>{});

         

          // add the card to the user's collection
          // SHOW THE PUZZLE
          getStoreCardColor(todo_copy, index_to_remove).then((color)=>{
            console.log('color!!! ' + color);
            var name = "img/";
            name = name + color + ".jpg";
            $('<div class="col-10 col-sm-6 col-lg-4 mx-auto my-3 store-item sweets" data-item="sweets">\
          <div class="card ">\
              <div class="img-container">\
              <img src=' + name + ' class="card-img-top store-img" alt="">\
              <span class="store-item-icon">\
                  <i class="fas fa-shopping-cart"></i>\
              </span>\
              </div>\
              <div class="card-body">\
              <div class="card-text d-flex justify-content-between text-capitalize">\
                  <h5 id="store-item-name">sweet item</h5>\
                  <h5 class="store-item-value">$ <strong id="store-item-price" class="font-weight-bold">5</strong></h5>\
              </div>\
              </div>\
          </div>\
          <button class="sell_button">SELL</button>\
          <!-- end of card-->\
          </div>').appendTo('#store-items-2');
          });
          // getSpecificPuzzleColor(todo_copy, data.extra, index_to_remove).then((color)=>{
          //   console.log('color!!! ' + color);
          //   var name = "img/";
          //   name = name + color + ".jpeg";
          //   $('<div class="col-10 col-sm-6 col-lg-4 mx-auto my-3 store-item sweets" data-item="sweets">\
          // <div class="card ">\
          //     <div class="img-container">\
          //     <img src=' + name + 'class="card-img-top store-img" alt="">\
          //     <span class="store-item-icon">\
          //         <i class="fas fa-shopping-cart"></i>\
          //     </span>\
          //     </div>\
          //     <div class="card-body">\
          //     <div class="card-text d-flex justify-content-between text-capitalize">\
          //         <h5 id="store-item-name">sweet item</h5>\
          //         <h5 class="store-item-value">$ <strong id="store-item-price" class="font-weight-bold">5</strong></h5>\
          //     </div>\
          //     </div>\
          // </div>\
          // <button class="sell_button">SELL</button>\
          // <!-- end of card-->\
          // </div>').appendTo('#store-items-2');
          // });
          

           // remove the card from store
           removeFromStore(todo_copy, index_to_remove).then(()=>{});
           $(this).parent().hide();
 







        } else {
          console.log("You pressed Cancel!");
        }
        
        
          
      });

      

    
    });

    this.$myCollectionShow.click(()=>{
      $('#loginSection').hide();
      $('#createSection').hide();
      $('#listSection').hide();
      $('#store').hide();
      $('#myCollection').show();

      // check store
      this.todo.getCardNumber(this.account).then((size) => {
        console.log("USER CARD NUM " + size/1);
      });
    });

    //test remove
    $('#test').click(()=>{
      this.todo.remove(this.account, 0, {from: this.account, gas: 300000} ).then(()=>{
        this.todo.getCardNumber(this.account).then((card_size)=>{
          console.log("***************************");
          console.log('card size ' + card_size/1);
          console.log("****************************");
        });
      });
    });



    // 登录操作
    this.$login.on('submit', (event) => {
      event.preventDefault();
      console.log("account: " + this.$account.val());
      console.log("password: " + this.$password.val());


      

     


      try{
        $(document).off('click', '.sell_button');
        console.log(this.web3.personal.unlockAccount(this.$account.val(), this.$password.val()));
        
        this.account = this.$account.val(); //callback???

        $(document).on('click', ".sell_button", { extra : this.account, todo_instance: this.todo }, function(event){
          alert("sell button click");  
          var data = event.data;
          var todo_copy = data.todo_instance;
          var index_to_remove = $(this).parent().index();
          console.log(data.extra);
          console.log('index to remove ' + index_to_remove);  
          console.log('index to remove2 ' + index_to_remove);
          console.log(todo_copy);
          
          
          var txt;
          var person = prompt("Please enter the price(only number supported!):", "100000000");
          if(person.match(/^\d+$/)) {
              var store_color;

              alert("OK!");
              // remove(sell)
              getSpecificPuzzleColor(todo_copy, data.extra, index_to_remove).then((color) => {
                store_color = color/1;
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log(store_color);
                // render the new card to store
                // SHOW THE PUZZLE
                var name = "img/";
                name = name + store_color + ".jpg";
                console.log('test name ' + name);
                $('<div class="col-10 col-sm-6 col-lg-4 mx-auto my-3 store-item sweets" data-item="sweets">\
                <div class="card ">\
                    <div class="img-container">\
                    <img src="' + name + '" class="card-img-top store-img" alt="">\
                    <span class="store-item-icon">\
                        <i class="fas fa-shopping-cart"></i>\
                    </span>\
                    </div>\
                    <div class="card-body">\
                    <div class="card-text d-flex justify-content-between text-capitalize">\
                        <h5 id="store-item-name">sweet item</h5>\
                        <h5 class="store-item-value">$ <strong id="store-item-price" class="font-weight-bold">5</strong></h5>\
                    </div>\
                    </div>\
                </div>\
                <button class="buy_button">BUY</button>\
                <!-- end of card-->\
                </div>').appendTo('#store-items');
              });
              


              

              // should add before remove
              addCardToStore(todo_copy, data.extra, Math.floor(person), index_to_remove).then(()=>{});
              remove(todo_copy, data.extra, index_to_remove, Math.floor(person)).then(()=>{});
              //$(this).parent().empty();
              $(this).parent().hide();


              
              


              
          }
          else {
            alert("Please input the number!");
          }
          
            
        });

        
        
        console.log(this.account);
        
        // 储存起来
        this.todo.checkAccount().then((val) => {
          console.log("boollllbefore val: " + val);
          // // RERENDER THE LIST
          // this.todo.getAccount().then((val) => {
          //   getItemTasks(this.todo, val)
          //   .then((tasks) => {
          //     console.log("kkkkali");
          //     console.log(tasks[0]);
          //     console.log("in item task promise " + this.account);
          //     renderTasks(this.$tasks, tasks);
          //   });

          // });


          this.todo.getAccountItemNumber(this.account).then((size) => {
            if(size % 30 == 0) {
              console.log("NEWWWWWWWWWWWWWWWWWWWWWWWWW!");
              this.puzzleIndex = Math.floor(Math.random() * 10 % 5);
              console.log("test index " + this.puzzleIndex);
              this.todo.storePuzzleIndex(
                this.account,
                this.puzzleIndex,
                {from: this.account, gas: 1000000}  // 要写明这个才有交易 1000000
              ).then(() => {
                console.log('index stored!');
               
               
              }).then(() => {

                this.todo.getPuzzle(this.account).then((index)=>{
                  console.log("index ,,,, " + index);
                  
                });
              });

            }
            else {
              this.todo.getPuzzle(this.account).then((index)=>{
                console.log("index has ,,,, " + index);
                this.puzzleIndex = index;
                
              });
            }
          });

          // test
          //this.todo.getPuzzle(this.account).then((val)=>{console.log("puzzle !!!! " + val)});

          
          // if(size == 0) {
          //   this.todo.storePuzzleIndex(this.account, this.size);
          // }
         

          // RENDER THE PUZZLE
          this.todo.getAccountItemNumber(this.account).then((size) => {
            console.log('+++++++++++++++++++');
            console.log(size/1);
            let tbl_td = document.getElementById("calendar-body").getElementsByTagName("td"); // cells
            // first we should clear the cell of the last account
            for(let i = 0; i < 30; i++) {
              tbl_td[i].style.backgroundColor = "white";  
            }

            // then render the new
            this.todo.getPuzzle(this.account).then((index)=>{
              console.log("index has ,,,, " + index);
              this.puzzleIndex = index;
              let filled_num = size % 30;
              for(let i = 0; i < filled_num; i++) {
                tbl_td[i].style.backgroundColor = colors[this.puzzleIndex];  
              }
              
            });
            
          
          });

          
          // RENDER THE COLLECTION
          this.todo.getCardNumber(this.account).then((card_size) => {
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
            console.log('card size ' + card_size/1);
            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
            // FIRST CLEAR
            $('#store-items-2').empty();
            // ADD
            for(let i = 0; i < card_size; i++) {
              getSpecificPuzzleColor(this.todo, this.account, i).then((color) => {
                var store_color = color/1;
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log(store_color);
                // render the new card to store
                // SHOW THE PUZZLE
                var name = "img/";
                name = name + store_color + ".jpg";
                console.log('test name ' + name);
                $('<div class="col-10 col-sm-6 col-lg-4 mx-auto my-3 store-item sweets" data-item="sweets">\
                <div class="card ">\
                    <div class="img-container">\
                    <img src="' + name + '" class="card-img-top store-img" alt="">\
                    <span class="store-item-icon">\
                        <i class="fas fa-shopping-cart"></i>\
                    </span>\
                    </div>\
                    <div class="card-body">\
                    <div class="card-text d-flex justify-content-between text-capitalize">\
                        <h5 id="store-item-name">sweet item</h5>\
                        <h5 class="store-item-value">$ <strong id="store-item-price" class="font-weight-bold">5</strong></h5>\
                    </div>\
                    </div>\
                </div>\
                <button class="sell_button">SELL</button>\
                <!-- end of card-->\
                </div>').appendTo('#store-items-2');
              });
            }
          });

          


          
        
        });
        getAccount(this.web3).then((fund_account)=>{
          this.fund_account = fund_account;
          this.todo.fund({from:this.fund_account
            ,value:68491657500000000, gas:1000000}); //1000000
        });
        

        
        

       
        
      
      } catch (e) {
        console.log('[debug unlockAccount]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         request e', e)
        console.log("nonono");
      } 

      console.log("check before store " + this.account);
      
      // wrong
      // this.todo.storeAccount(this.account);
      this.todo.storeAccount(
        this.account,
        {from: this.account, gas: 1000000}  // 要写明这个才有交易 1000000
      ).then(() => {
        console.log('Addr stored!');
       
       
      }).then(() => {
        this.todo.getAccount().then((val) => {console.log("test addr " + val);});
       // this.todo.getPuzzle(this.account).then((index) => {console.log("test puzzle index " + index);});
        
        
        
        
      });
     
      

    });


    





    this.$newTask.on('submit', (event) => {
        
       
        event.preventDefault();
        console.log("acc" + this.account);

        // FUND
        getAccount(this.web3).then((fund_account)=>{
          this.fund_account = fund_account;
          this.todo.fund({from:this.fund_account
            ,value:68491657500000000, gas:1000000}); //1000000
        });
        


        this.todo.createTask2(
          this.$taskContent.val(), 
          this.$taskAuthor.val(), 
          this.account,
          
          
          {from: this.account, gas: 300000}  // 要写明这个才有交易 1000000
        ).then(() => {
          console.log('Task created!');
          console.log(this.account);
          
          ////////////////////////////////////////////
          this.todo.addMoney({from:this.account, gas:300000}); //1000000
    
         
        })
        .catch((error) => {
          console.log(`Oops... There was an error: ${error}`);
        });

        this.todo.getIdNumber2().then((size) => {console.log("size " + size);});
        // 这里可以获得某个帐号的特定item的内容了
        this.todo.getItemTask(0, this.account).then((item) => {console.log("content: " + item[2]);});
        // 这里可以获得某个帐号item的数目了
        this.todo.getAccountItemNumber(this.account).then((size) => {
          console.log("account: " + this.account);
          console.log("size number: " + size);
        
        });
        this.todo.checkAccount().then((val) => {console.log("bool val: " + val);});

        //RERENDER
        // this.todo.getAccount().then((val) => {
        //   getItemTasks(this.todo, val)
        //   .then((tasks) => {
        //     console.log("kkkkali");
        //     console.log(tasks[0]);
        //     console.log("in item task promise " + this.account);
        //     renderTasks(this.$tasks, tasks);
        //   });

          
        // });

        this.todo.getPuzzle(this.account).then((index) => {console.log("test puzzle index " + index);});
        
       
        //this.todo.storeAccount(this.account);

        // 这里可以获得某个帐号item的数目了
        this.todo.getAccountItemNumber(this.account).then((size) => {
          console.log('@@@@@@@@@@@@@@@@@@@@@@@');
          console.log("account: " + this.account);
          console.log("size number: " + size);
          
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
          var row_index = Math.floor((size-1)%30 / 7);
          var col_index = (size-1)%30 % 7;
          console.log('row_index ' + row_index);
          console.log('col_index ' + col_index);
          // change the puzzle
          // first we change the puzzle background color
          let tbl = document.getElementById("calendar-body"); // body of the calendar
          
          console.log('---------------------------------');
          console.log(tbl.rows[row_index].cells[col_index].textContent);
          tbl.rows[row_index].cells[col_index].style.backgroundColor = colors[this.puzzleIndex];
          console.log('---------------------------------');
          console.log("hahaha " + this.account);

          // IF THE PUZZLE IS FILLED (size reach the times of 30)
          if(size != 0 && size % 30 == 0) {
            alert("CONGRATULATION! YOU GOT A CARD!");
            // clear the puzzle
            let tbl_td = document.getElementById("calendar-body").getElementsByTagName("td"); // cells
            for(let i = 0; i < 30; i++) {
              tbl_td[i].style.backgroundColor = "white";  
            }

            // ADD THE PUZZLE TO YOUR COLLECTION
            this.todo.addToPuzzleCollection(this.account, this.puzzleIndex, {from: this.account, gas: 1000000}).then(()=>{
              console.log("ADD TO COLLECTION");
              this.todo.getPuzzleCollection(this.account, 0).then((num) => {
                console.log("num " + num/1);
                
              });
            });

            // SHOW THE PUZZLE
            var name = "img/";
            name = name + this.puzzleIndex + ".jpg";
            console.log("test name " + name);
            $('<div class="col-10 col-sm-6 col-lg-4 mx-auto my-3 store-item sweets" data-item="sweets">\
            <div class="card ">\
                <div class="img-container">\
                <img src="' + name + '" class="card-img-top store-img" alt="">\
                <span class="store-item-icon">\
                    <i class="fas fa-shopping-cart"></i>\
                </span>\
                </div>\
                <div class="card-body">\
                <div class="card-text d-flex justify-content-between text-capitalize">\
                    <h5 id="store-item-name">sweet item</h5>\
                    <h5 class="store-item-value">$ <strong id="store-item-price" class="font-weight-bold">5</strong></h5>\
                </div>\
                </div>\
            </div>\
            <button class="sell_button">SELL</button>\
            <!-- end of card-->\
            </div>').appendTo('#store-items-2');


            // NEW PUZZLE
            this.todo.getAccountItemNumber(this.account).then((size) => {
              if(size % 30 == 0) {
                console.log("NEWWWWWWWWWWWWWWWWWWWWWWWWW!");
                this.puzzleIndex = Math.floor(Math.random() * 10 % 5);
                console.log("test index " + this.puzzleIndex);
                this.todo.storePuzzleIndex(
                  this.account,
                  this.puzzleIndex,
                  {from: this.account, gas: 1000000}  // 要写明这个才有交易 1000000
                ).then(() => {
                  console.log('index stored!');
                 
                 
                }).then(() => {
  
                  this.todo.getPuzzle(this.account).then((index)=>{
                    console.log("index ,,,, " + index);
                    
                  });
                });
  
              }
              else {
                this.todo.getPuzzle(this.account).then((index)=>{
                  console.log("index has ,,,, " + index);
                  this.puzzleIndex = index;
                  
                });
              }
            });
          }

        });

        // this.todo.getPuzzleCellNumber(this.account).then((size) => {
        //   console.log('pppsize ' + size);
        // });

        


    });
    
  

    return new Promise((resolve, reject) => {
      this.todo.getAccount().then((val) => {
        getItemTasks(this.todo, val)
        .then((tasks) => {
          console.log("kkkkali");
          console.log(tasks[0]);
          console.log("in item task promise " + this.account);
          renderTasks(this.$tasks, tasks);
        });
      });
    });
  } 
}

export default App;