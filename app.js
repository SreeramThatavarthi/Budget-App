//Budget Controller
var budgetController = (function(){
    var Income=function(id,description ,value)
         {
             this.id = id;
             this.description = description;
             this.value = value;
         }; 
    var Expense=function(id,description ,value)
         {
             this.id = id;
             this.description = description;
             this.value = value;
             this.percentage=-1
         };
    Expense.prototype.calPercentage = function(totalInc)
    {
        if(totalInc>0)
            {
        this.percentage=Math.round((this.value/totalInc)*100);
            }
    };
    Expense.prototype.returnPercentage = function()
    {
        return this.percentage;
    };
    var calculateTotal=function(type)
        {
            console.log(type);
            var sum=0;
            console.log(data.allItems.exp);
            data.allItems[type].forEach(function(curr)
             {
              sum+=curr.value;
            });
            data.totals[type]=parseInt(sum);
        };
    var data={
        allItems:{
            exp : [],
            inc : []
        },
        totals:
        {
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
        
        };
    return{
        additem:function(typ,des,val){
            var newItem,ID;
            
            if(data.allItems[typ].length>0)
                {
                    //stores the number by incrementing 1
                    ID = data.allItems[typ][data.allItems[typ].length -1].id +1;
                }
            else{
                ID=0;
            }
            if(typ === 'inc')
                {
                    newItem = new Income(ID,des,val);
                }
            else if(typ === 'exp')
                {
                    newItem = new Expense(ID,des,val);
                }
            data.allItems[typ].push(newItem);
            return newItem;
        },
        calculatePercentages:function()
        {
            data.allItems.exp.forEach(function(curr)
          {
            curr.calPercentage(data.totals.inc);
            });
        },
        getPercentages:function()
        {
            var allper;
             allper=data.allItems.exp.map(function(curr)
            {
                 console.log(curr);
             return curr.returnPercentage();
            });
            console.log(allper);
            return allper;
        },
        
        deleteItem:function(type,id)
        {
            var ids,index;
            ids=data.allItems[type].map(function(current)
             {
                return current.id;
            });
            index=ids.indexOf(id);
            if(index!==-1)
                {
                    data.allItems[type].splice(index,1);
                }
        },
        calculateBudget:function()
        {
          calculateTotal('inc');
          calculateTotal('exp');
            data.budget=data.totals.inc-data.totals.exp;
        if(data.totals.inc>0)
        {
             data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
        }
        },
        returnBudget:function()
        {
            var budgetdata={
            totalInc:data.totals.inc,
            totalExp:data.totals.exp,
            budget:data.budget,
            percentage:data.percentage
            };
            return budgetdata;
            
        },
        testing:function(){
           console.log(data);
        }
    };
    
})();
//UI controller
var uiController =(function(){
    var Domstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        button : '.add__btn',
        presskey : 'keypress',
        incomelist:'.income__list',
        expenselist:'.expenses__list',
        budgetvalue:'.budget__value',
        incomevalue:'.budget__income--value',
        expensevalue:'.budget__expenses--value',
        percentage:'.budget__expenses--percentage',
        container:'.container',
        expPercentage:'.item__percentage',
        displaymon:'.budget__title--month'
    };
    var formatNumber=function(value,type)
    {
        var int,dec;
        value=Math.abs(value);
        value=value.toFixed(2);
        valuesplit= value.split('.');
        int = valuesplit[0];
        
        if(int.length>3)
            {
                int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }
        dec = valuesplit[1];
        
        return (type ==='exp' ? '-' :'+')+' '+int+'.'+dec;
        
    };
   var nodeListforEach = function(list,callback)
     {
        for(var i=0;i<list.length;i++)
            {
                callback(list[i],i);
            }
    }
        
    return{
        getInput:function()
        {
            return{
            type : document.querySelector(Domstrings.inputType).value,
            description : document.querySelector(Domstrings.inputDescription).value,
            value : parseFloat(document.querySelector(Domstrings.inputValue).value)
            };
        },
        getDomstrings:function()
        {
            return Domstrings;
        },
        
        displayPercentages:function(percentages)
        {
          var fields=document.querySelectorAll(Domstrings.expPercentage);
            
          nodeListforEach(fields,function(current,index)
            {
              if(percentages[index]>0)
                  {
                      current.textContent=percentages[index]+'%';
                  }
              else{
                    current.textContent='---';
              }
              
          });
        },
        displayMonth:function()
        {
            var get,month,year,months;
            get=new Date();
            months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            month = get.getMonth();
            year= get.getFullYear();
            
            document.querySelector(Domstrings.displaymon).textContent=months[month]+' '+year; 
        },
        itemList1:function(item,type)
            {          
               var html,newHtml,element;
            if(type==='inc')
                {
                    element=Domstrings.incomelist;
            html='<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix">            <div class="item__value">%value%</div> <div class="item__delete">  <button class="item__delete--btn"><img src="ionicon/close-circle-outline.svg" height="22" width="22"></button>  </div></div>  </div>'
                }
            if(type==='exp')
                {
                    element=Domstrings.expenselist;
            html='<div class="item clearfix" id="exp-%id%">   <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><img src="ionicon/close-circle-outline.svg" height="22" width="22">               </button></div>    </div>    </div>'
                }
            newHtml=html.replace('%id%',item.id);
            newHtml=newHtml.replace('%description%',item.description);
            newHtml=newHtml.replace('%value%',formatNumber(item.value,type));
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            },
        clearfields:function()
        {
           var fields,fieldsArr; fields=document.querySelectorAll(Domstrings.inputType+','+Domstrings.inputDescription+','+Domstrings.inputValue);
             fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array)
            {
                 current.value="";          
            });
            fieldsArr[0].value="inc";
        },
        changecolor:function()
        {
          var items;
            items = document.querySelectorAll(Domstrings.inputType +','+Domstrings.inputDescription+','+Domstrings.inputValue);
            
            nodeListforEach(items,function(cur){
                            
               cur.classList.toggle('red-focus');
            });
        },
        delItem:function(selectID)
        {
            var el;
          el=document.getElementById(selectID);
            console.log(el);
          el.parentNode.removeChild(el);
        },
        displayBudget:function(obj)
        {
            obj.budget>0 ?type='inc': type='exp';
           document.querySelector(Domstrings.budgetvalue).textContent=formatNumber(obj.budget,type);
           document.querySelector(Domstrings.incomevalue).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(Domstrings.expensevalue).textContent=formatNumber(obj.totalExp,'exp');
            if(obj.percentage>0)
                {
                document.querySelector(Domstrings.percentage).textContent=obj.percentage+'%';
                }
            else
                {
                    document.querySelector(Domstrings.percentage).textContent='---';
                }
        
        }
    };
})();
//global app controller
var Controller =(function(budctrl , uictrl){
    var setupEventListeners = function()
    {
        var Dom = uictrl.getDomstrings();
        
        document.querySelector(Dom.button).addEventListener('click',ctrlAddItem);
          document.addEventListener(Dom.presskey,function(event)
          {
            if(event.keyCode === 13 || event.which === 13)
            {
                ctrlAddItem();
            }
        });
        document.querySelector(Dom.container).addEventListener('click',ctrlDelItem);
        document.querySelector(Dom.inputType).addEventListener('change',uictrl.changecolor);
    };
    var updatepercentages=function()
    {
        //update the percentages
        budctrl.calculatePercentages();
        //store the percentages
        var pers =budctrl.getPercentages();
        //change percentages on ui
        uictrl.displayPercentages(pers);
        
    }
    var updateBudget=function(){
            
        //calculate the budget
        budctrl.calculateBudget();
        
        //return the budget
       var budgetobj= budctrl.returnBudget();
        
        //display the budget on the ui
        uictrl.displayBudget(budgetobj);
    }
    var ctrlAddItem = function()
    {
        var input,newitem;
        //get the field inpt data
        
        input=uictrl.getInput();
        if(input.description!==""  && input.value>0)
            {
                //add item to the budget controller
                newitem =budctrl.additem(input.type,input.description,input.value);

                //add the item to the ui
                uictrl.itemList1(newitem,input.type);

                //clear the fields
                uictrl.clearfields();
                
                //budget update
                
                updateBudget();
                
                updatepercentages();
        
            }

    };
    var ctrlDelItem=function(event)
    {
        var itemID,splitID,type,ID;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID)
            {
                splitID=itemID.split('-');
                type=splitID[0];
                ID=parseInt(splitID[1]);
                
                //del the item from the data structure
                  
                budctrl.deleteItem(type,ID);
                
                //del the item from the ui
                uictrl.delItem(itemID);
                
                //update the new budget
                updateBudget();
                
                updatepercentages();
            }
    };
    return {
        ini:function()
        {
            console.log('hai');
            setupEventListeners();
            uictrl.displayMonth();
            uictrl.displayBudget({
            totalInc:0,
            totalExp:0,
            budget:0,
            percentage:-1
            });
        }
    };
  
})(budgetController , uiController);


Controller.ini();