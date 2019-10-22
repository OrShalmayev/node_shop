    (function(){
        
        function calcTotal(){
            const total = document.querySelector('[name=total]');
            const prices = Array.from(document.querySelectorAll('[name=price]')).map( p => p.value);
            const qty = Array.from(document.querySelectorAll('[name=quantity]')).map( q => q.value);
            // Price cant be less than 1
            Array.from(document.querySelectorAll('[name=price]')).forEach( p => {
                p.addEventListener('change', (e) => {
                    if(p.value < 1 || isNaN(parseInt(p.value)) ) p.value = 1;
                })
            });
            // quantity cant be lesss than 1
            Array.from(document.querySelectorAll('[name=quantity]')).forEach( q => {
                q.addEventListener('change', (e) => {
                    if(q.value < 1 || isNaN(parseInt(q.value)) ) q.value = 1;
                })
            });
            // calculating the totaal price
            let totalPrice = 0;
            for(let i = 0; i < prices.length; i++){
                totalPrice += parseInt(prices[i]) * parseInt(qty[i]);
            }
            // updating the total price
            total.value = totalPrice;
            console.log(total, prices, qty, document.querySelector('.edit-order'))
        }
        // listening to a change in the form
        document.querySelector('.edit-order').addEventListener('click', calcTotal);
        // invoking the function
        calcTotal();

    })();
    