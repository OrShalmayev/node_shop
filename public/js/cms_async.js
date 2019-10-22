(function(){
   // Executing the function
   asyncOperation('controller-btn');

   function asyncOperation(operatorClass){
      Array.from(document.querySelectorAll(`.${operatorClass}`)).forEach( btn => {
         btn.addEventListener(`click`, (e) => {
            let btnParent = (btn.parentNode.className === 'card__actions') ? btn.parentNode : btn.parentNode.parentNode ;
            let pid = btn.parentNode.querySelector(`[name=product_id]`).value;
            let csrf = btn.parentNode.querySelector(`[name=_csrf]`).value;
            let method = btn.parentNode.querySelector(`[name=_method]`).value;
            let elemContainer = btn.closest(`tr`); 
            let urlPath = btnParent.dataset.path
            fetch(urlPath, {
               method: method,
               headers: {
                  'csrf-token': csrf
               }
            }).then((result) => {
               // returns a promise
               return result.json();
            })
            .then( data => {
               console.log(data);
               elemContainer.parentNode.removeChild(elemContainer);
            })
            .catch((err) => {
               console.error(err);
            });
   
            /* DEBUG */
            // console.log();
         });
      });

   }



})()