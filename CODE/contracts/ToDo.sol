pragma solidity ^0.4.24;

contract ToDo {
 struct Task {
    uint id;
    uint date;
    string content;
    string author;
    bool done;
  }

  
  uint public lastTaskId;
  uint public lastTaskId2;
  uint nonce;
  address public now_account;
  bool public have_account;
  uint[] taskIds;
  uint[] taskIds2;
  uint price;
  uint sellCardColor;
  address account0 = 0x006ddc02d75c0444419397a6bf6b00ba31ffbb13;//????
  

  mapping(uint => Task) public tasks;
  mapping(address => Task[]) public taskss;
  mapping(address => uint) public num_store;
  mapping(address => uint) public puzzle_cell_num; // no use
  mapping(address => uint) public now_process_puzzle; // store the no. of the puzzle now process
  mapping(address => uint[]) public puzzle_collection; // user's puzzle collection
  mapping(address => uint) public puzzle_collection_onedimension; // user's puzzle collection
  mapping(address => uint) public card_num; // user's card number

  address[] public store_card_account; // id -> address
  uint[] public store_card_price; // id -> price
  uint[] public store_card_type; // id -> card_type
  uint store_card_num = 0; // the number of cards in the store
   

  event TaskCreated(uint id, uint date, string content, string author, bool done);

  constructor() public {
    lastTaskId = 0;
    have_account = false;
    price = 68491657500000000;
   
  }

  // 可以在智能合约里面写一个now process存一下
  function storeAccount(address addr) public {
    //address addr = addr_str;
    now_account = addr;
  }

  function remove(address addr, uint index) public {
    if (index >= puzzle_collection[addr].length) return;

    sellCardColor = puzzle_collection[addr][index]; // store the color

    for (uint i = index; i<puzzle_collection[addr].length-1; i++){
      puzzle_collection[addr][i] = puzzle_collection[addr][i+1];
    }
    delete puzzle_collection[addr][puzzle_collection[addr].length-1];
    puzzle_collection[addr].length--;
    card_num[addr] = card_num[addr] - 1;
  }

  function removeFromStore(uint index) public {
    if(index >= store_card_num) return;

    for (uint i = index; i<store_card_account.length-1; i++){
      store_card_account[i] = store_card_account[i+1];
      store_card_price[i] = store_card_price[i+1];
      store_card_type[i] = store_card_type[i+1];
    }
    delete store_card_account[store_card_account.length-1];
    delete store_card_price[store_card_price.length-1];
    delete store_card_type[store_card_type.length-1];
    store_card_account.length--;
    store_card_price.length--;
    store_card_type.length--;
    store_card_num = store_card_num - 1;

  }

  function addCardToStore(address addr, uint price_in, uint index) public {
    store_card_account.push(addr);
    store_card_price.push(price_in);
    store_card_type.push(puzzle_collection[addr][index]);
    store_card_num = store_card_num + 1;
  }

  function getStoreCardInfo(uint id) public constant returns (address, uint, uint) {
    return (store_card_account[id], store_card_price[id], store_card_type[id]);
  }

  function getStoreCardColor(uint id) public constant returns(uint) {
    return store_card_type[id];
  }

  function getStoreCardAccount(uint id) public constant returns(address) {
    return store_card_account[id];
  }

  function getStoreCardPrice(uint id) public constant returns(uint) {
    return store_card_price[id];
  }

  function getStoreCardNumber() public constant returns (uint) {
    return store_card_num;
  }

  function test() public constant returns (bool){
    return true;
  }

  function addToPuzzleCollection(address addr, uint index) public {
    puzzle_collection[addr].push(index);
    card_num[addr] = card_num[addr] + 1;
  }

  function buyCardFromStore(address addr, uint index) public {
    puzzle_collection[addr].push(store_card_type[index]);
    card_num[addr] = card_num[addr] + 1;
  }

  function getPuzzleCollection(address addr, uint id) public constant returns(uint) {
    return puzzle_collection[addr][id];
  }

  function getCardNumber(address addr) public constant returns (uint) {
    return card_num[addr];
  }

  function storePuzzleIndex(address addr, uint index) public {
    now_process_puzzle[addr] = index;

  }

  function getAccountItemNumber(address addr) public constant returns(uint) {
    return num_store[addr];
  }

  
  function checkAccount() public constant returns (bool) {
    return have_account;
  }

  function setAccount() public {
    have_account = true;
  } 

  function getAccount() public constant returns (address) {
    return now_account;
  } 

  function createTask(string _content, string _author) public {
    lastTaskId++;
    tasks[lastTaskId] = Task(lastTaskId, now, _content, _author, false);
    taskIds.push(lastTaskId);
    
    emit TaskCreated(lastTaskId, now, _content, _author, false);
    // 增加一个获取钱的函数
    // 检查时间 如果今天已经有记录 不再增加钱
    // 如果记的账是今天的第一条 增加钱
  }

  // 将条目加到特定账户里面
  function createTask2(string _content, string _author, address addr) public {
    taskss[addr].push(Task(num_store[addr], now, _content, _author, false));
    taskIds2.push(lastTaskId2);
    now_account = addr;
    num_store[addr] = num_store[addr] + 1;
   
    

    
    
    /////////////////////////////////////////////
    

    
    // 增加一个获取钱的函数
    // 检查时间 如果今天已经有记录 不再增加钱
    // 如果记的账是今天的第一条 增加钱
  }

  function getTaskIds() public constant returns(uint[]) {
    return taskIds;
  }

  function getTaskIds2() public constant returns(uint[]) {
    return taskIds2;
  }

  function getIdNumber2() public constant returns(uint) {
    return lastTaskId2;
  }

  

  function getPuzzleCellNumber(address addr) public constant returns(uint) {
    return puzzle_cell_num[addr];
  }

  function getUser() public returns(address user){
    return user;
  }

  /* function userLogin(address addr, string psw) public returns (bool) {
    return 
  } */

  function getTaskFixtures(uint _id) public constant returns(
      uint,
      uint,
      string,
      string,
      bool
    ) {
    return (0, now, "Create more tutorials for ETB", "Julien", false); 
  }

  function getTask(uint id) taskExists(id) public constant 
    returns(
      uint,
      uint,
      string,
      string,
      bool
    ) {

      return(
        id,
        tasks[id].date,
        tasks[id].content,
        tasks[id].author,
        tasks[id].done
      );
    }

  
    // 获取某个帐号的item的某个特定条目
    function getItemTask(uint id, address addr) public constant  // solidity 不支持一整个结构体返回是吗???
    returns(
      uint,
      uint,
      string,
      string,
      bool
    ) {
      return (
        id,
        taskss[addr][id].date,
        taskss[addr][id].content,
        taskss[addr][id].author,
        taskss[addr][id].done

      );
      
    }

    modifier taskExists(uint id) {
      if(tasks[id].id == 0) {
        revert();
      }
      _;
    }


    function () payable {
      
    }

    function  addMoney () 
    public 
    returns (bool) {
        now_account.transfer(price);
        
        return true;
    }

    function payForSeller(uint id) public returns (bool){
      store_card_account[id].transfer(store_card_price[id]);
      return true;
    }

    function fund() payable returns(bool success) {
  
        return true;
    }

   


   

    function getPuzzle(address addr) public constant returns (uint) {
      //return now_process_puzzle[addr];
      return now_process_puzzle[addr];
      
    }

    function getSpecificPuzzleColor(address addr, uint index) public constant returns (uint) {
      return puzzle_collection[addr][index];
    }

}
