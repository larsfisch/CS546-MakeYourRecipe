(function ($) {
    updateCartPrice();
    orderAllLists();
    
    //$("input").on("change paste keyup", function() {
    $("input").on("change paste", function() {
        updateCartPrice();
    });
    
    $(".btn-remove-ingredient").on("click", function() {
        removeIngredient($(this).closest("li"), $(this).parent().find(".btn-add-ingredient"), $(this));
    });
    
    $(".btn-add-ingredient").on("click", function () {
        addIngredient($(this).closest("li"), $(this), $(this).parent().find(".btn-remove-ingredient"));
    });
    
    $(".btn-remove-recipe").on("click", function () {
        var parent = $(this).parent();
        parent.find("h3").addClass("removed");
        parent.find("ul").addClass("removed");
        
        $(this).addClass("hide");
        parent.find(".btn-add-recipe").removeClass("hide");
        
        parent.find("li").each(function () {
            removeIngredient($(this), $(this).find(".btn-add-ingredient"), $(this).find(".btn-remove-ingredient"));
        });
        
        parent.find("ul").addClass("hide");
        orderAllLists();
    });
    
    $(".btn-add-recipe").on("click", function () {
        var parent = $(this).parent();
        parent.find("h3").removeClass("removed");
        parent.find("ul").removeClass("removed");
        
        $(this).addClass("hide");
        parent.find(".btn-remove-recipe").removeClass("hide");
        
        parent.find("li").each(function () {
            addIngredient($(this), $(this).find(".btn-add-ingredient"), $(this).find(".btn-remove-ingredient"));
        });
        
        parent.find("ul").removeClass("hide");
        orderAllLists();
    });
        
    function updateCartPrice() {
        var cartTotal = 0;
        
        $("tbody > tr").each(function () {
            var recipeTotal = 0.0;
            var ingredientList = $(this).find("ul");

            ingredientList.children("li").each(function () {
                //ar form = $(this).find(".form-inline");
                var count = $(this).hasClass("removed") ? 0 : $(this).find("input").val();
                var price = $(this).find(".price").text();
                
                if (validateInput($(this), count)) {
                    removeError($(this));
                    recipeTotal += count * price;
                }
            });
            cartTotal += recipeTotal;
            recipeTotal = parseFloat(recipeTotal).toFixed(2);
            $(this).find(".recipe-price").text("$" + recipeTotal);
        });

        cartTotal = parseFloat(cartTotal).toFixed(2);
        $(".cart-price").text("$" + cartTotal);
    }
    
    function validateInput(form, value) {
        if (value == null | value == undefined || isNaN(value) || value === "") {
            addError(form, "Invalid: not a number");
            return false;
        } else if (value < 0) {
            addError(form, "Invalid: number below zero");
            return false;
        }
        
        return true;
    }
    
    function addError(element, error) {
        removeError(element); // remove previous error
        element.addClass("has-error");
        var error = $("<span class=\"help-block\"></span>").text(error);
        element.append(error);
    }
    
    function removeError(element) {
        element.find($(".help-block")).remove();
        element.removeClass("has-error");
    }
    
    function orderAllLists() {
        $("ul").each(function () {
            if (!$(this).hasClass("removed")) {
                orderList($(this));
                $(this).closest("tbody").prepend($(this).closest("tr"));
            }
        });
    }
    
    function orderList(list) {
        list.find("li").each(function () {
            if (!$(this).hasClass("removed")) {
                $(this).parent().prepend($(this));
                //list.prepend($(this));
            }
        });
    }
        
    function removeIngredient (listItem, addBtn, removeBtn) {
        listItem.addClass("removed");
        removeBtn.addClass("hide");

        listItem.find("input").addClass("hide");
        addBtn.removeClass("hide");
        
        orderList(listItem.closest("ul"));
        updateCartPrice();
    }
    
    function addIngredient (listItem, addBtn, removeBtn) {
        listItem.removeClass("removed");
        addBtn.addClass("hide");

        listItem.find("input").removeClass("hide");
        removeBtn.removeClass("hide");
              
        orderList(listItem.closest("ul"));
        updateCartPrice();
    }
    
})(jQuery);