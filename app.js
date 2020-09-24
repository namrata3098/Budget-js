

//BUDGET CONTROLLER
var budgetcontroller = (function(){

      var Expense = function(id,description,value) {
          this.id=id;
          this.description=description;
          this.value= value;
          this.percentage = -1;
      };

      Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

      var Income = function(id,description,value) {
        this.id=id;
        this.description=description;
        this.value= value;
      };
     
      var calculatetotal = function(type){
          var sum=0;
          data.allItems[type].forEach(function(cur){
              sum = sum + cur.value;
          });
          data.alltotal[type]= sum;
      };

      var data = {
          allItems : {
              exp: [],
              Inc: []
          } ,
          alltotal : {
              exp : 0,
              Inc :0
          },
          budget : 0 ,
          percentage : -1 
    
      }



      return{
          additem: function(type,des,val){                           // the input variable has the type,description and value
            var newitem ; 
             if (data.allItems[type].length > 0)
              {
              ID =  data.allItems[type][data.allItems[type].length - 1].id + 1;
              }
              else {
                  ID = 0;
              }

              if (type === 'exp'){                                    // check if its a income or expense 
                  newitem = new Expense(ID,des,val);
              }
              else if ( type === 'Inc'){
                  newitem = new Income(ID,des,val);
              }
             //push item to the data structure
             data.allItems[type].push(newitem);  

             //return the newitem 
             return newitem;
          } ,

         deleteitem : function(types,id){

            var ids,index,type ;

            if (types == 'income'){
                type = 'Inc';
            }else if (types == 'expense'){
                type = 'exp';
            }
            
                ids = data.allItems[type].map(function(current) {
                    return current.id;  
            });
            
             index = ids.indexOf(id);

             if(index !== -1 ){
                 data.allItems[type].splice(index,1);
             }
         },

          calculatebudget : function(){
               //1. calculate all the income and the expense

                calculatetotal('exp');
                calculatetotal('Inc');

               //2.calculate the budget = income - expense 

               data.budget = data.alltotal.Inc - data.alltotal.exp ;

               //3.calculate the percentage of income we spent 
               if (data.alltotal.Inc >0){
                data.percentage = Math.round((data.alltotal.exp / data.alltotal.Inc ) * 100) ;
               }else {
                   data.percentage = -1;
               }
               
          },

          getBudget : function(){
                  return {
                    budget : data.budget,
                    totalinc : data.alltotal.Inc,
                    totalexp : data.alltotal.exp,
                    percentage : data.percentage
                  };
          },


        calculatePercentages: function() {
             
            data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.alltotal.Inc);
            });
        },
        
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

          testing: function(){
              console.log(data);
          }
      };
})();



//UI CONTROLLER

var UIcontroller = (function(){

    var Domstrings= {
            inputtype : '.add__type',
            inputdesp : '.add__description',
            inputvalue :'.add__value',
            inputbtn : '.add__btn',
            incomeContainer : '.income__list',
            expenseContainer: '.expenses__list',
            incomelabel : '.budget__income--value',
            expenselabel:'.budget__expenses--value' ,
            percentagelabel:'.budget__expenses--percentage' , 
            budgetlabel:'.budget__value',
            container : '.container',
            experclabel: '.item__percentage',
            datelabel: '.budget__title--month'
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return { 


    addListitem : function(obj,type){

     // create HTML text with placeholders
      var html,newhtml,element; 
      if ( type === 'Inc'){
      element =Domstrings.incomeContainer;    
      html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    } else if ( type === 'exp'){
      element = Domstrings.expenseContainer;
      html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    }

    //replace placeholders
    newhtml= html.replace('%id%',obj.id);
    newhtml= newhtml.replace('%description%',obj.description);
    newhtml= newhtml.replace('%value%',obj.value);

    document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

    //Insert HTML into DOM


  },

  deletelistitem : function( selectorID){
    var el = document.getElementById(selectorID);

    el.parentNode.removeChild(el);
  },

  clearFeilds: function(){
     var feilds,feildarr ;
     feilds = document.querySelectorAll(Domstrings.inputdesp +','+ Domstrings.inputvalue);
    
     feildarr = Array.prototype.slice.call(feilds);
     console.log(feildarr);

     feildarr.forEach(function(current){
              current.value=""; 
     });

     feildarr[0].focus();
  },

  displaybudget : function(obj){
           document.querySelector(Domstrings.budgetlabel).textContent = obj.budget
           document.querySelector(Domstrings.expenselabel).textContent = obj.totalexp
           document.querySelector(Domstrings.incomelabel).textContent = obj.totalinc
           if (obj.percentage >0 ){
           document.querySelector(Domstrings.percentagelabel).textContent = obj.percentage + '%' ;
           }else {
            document.querySelector(Domstrings.percentagelabel).textContent = '--'
           }
           
  },

  displaypercentage : function(percentage){
      var fields = document.querySelectorAll(Domstrings.expenselabel);

      nodeListForEach(fields, function(current, index) {
                
        if (percentage[index] > 0) {
            current.textContent = percentage[index] + '%';
        } else {
            current.textContent = '---';
        }
    });

  },

  displaymonth : function(){
    var now,year,month;

    now = new Date();
    year = now.getFullYear();
    months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    month = now.getMonth()
    document.querySelector(Domstrings.datelabel).textContent = months[month] +' '+ year;
  },
    getDomstrings : function(){
         return Domstrings;
     }  ,  
    getinput: function() {
        return {
            type: document.querySelector(Domstrings.inputtype).value, // Will be either inc or exp
            description: document.querySelector(Domstrings.inputdesp).value,
            value: parseFloat(document.querySelector(Domstrings.inputvalue).value)
        };
       }
    };
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetctrl,UIctrl){
     

    var updatebudget = function(){
        //1.calculate the budget 
        budgetctrl.calculatebudget();
        //2.return the budget  
       var budget = budgetctrl.getBudget();
        //3.display budget on UI
        UIctrl.displaybudget(budget);
    };

    var updatepercentage = function(){
               //1. calculate percentage 
               budgetctrl.calculatePercentages();
             
               //2. Read percentage from the budget controller 
               var percentages = budgetctrl.getPercentages();
               //3.update the UI to the new percentage 
               UIctrl.displaypercentage(percentages);
    };


     var ctrladd = function(){

        var newitem, input ;
        //1. enter data from user 
          input = UIctrl.getinput();


          if (input.description !== "" && !isNaN(input.value) && input.value>0){
          
    //2. add the budget to the budget control
          newitem = budgetctrl.additem(input.type,input.description,input.value);
        
          
    //3. add to the UI
      UIctrl.addListitem(newitem,input.type);

    // 4.clear the value feild 
      UIctrl.clearFeilds();
   
      // 5. calculate the budget and  display 
      updatebudget();

      //6. update percentages 
      updatepercentage();


     }

     };



     var eventlistener = function(){
        var dom = UIctrl.getDomstrings();

        document.querySelector(dom.inputbtn).addEventListener('click',ctrladd);

        document.addEventListener('keypress',function(event){
              if (event.keyCode === 13 || event.which === 13){
                  ctrladd();
              }
       });
       document.querySelector(dom.container).addEventListener('click',cntrldeleteitem)
     }


     var cntrldeleteitem = function(){
         var itemID, splitID , ID, type ;
           itemID = event.target.parentNode.parentNode.parentNode.parentNode.id ;

           if(itemID){


               splitID = itemID.split('-');
               type = splitID[0];
               ID =  parseInt(splitID[1]);


               //1. delete the item from the ds 
               budgetctrl.deleteitem(type,ID);
               //2.delete the item from the UI 
               UIctrl.deletelistitem(itemID);
               //3. update and show new budget
               updatebudget();

               //4. update percentages 
               updatepercentage();
           }
     }
    
     return {
      init : function() {
         console.log('application has started');
         UIctrl.displaymonth();
         UIctrl.displaybudget({
            budget : 0,
            totalinc : 0,
            totalexp : 0,
            percentage : -1

         });
         eventlistener();
     }
    };



})(budgetcontroller,UIcontroller);

controller.init();

