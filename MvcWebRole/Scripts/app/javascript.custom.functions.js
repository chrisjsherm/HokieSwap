Array.prototype.removeDuplicateValues = function () {
    return this.filter(function (elem, pos, self) {
        return self.indexOf(elem) === pos;
    });
};

Array.prototype.removeDuplicateValues = function () {
    return this.filter(function (elem, pos, self) {
        return self.indexOf(elem) === pos;
    });
};

Number.prototype.validatePrice = function () {
    var re = /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/;
    return re.test(this);
};

String.prototype.cleanSearchString = function () {
    var searchString = this.removeMultipleWhitespaces();

    // Generate array, removing all characters except alphanumeric, whitespace, and double-quotes
    return searchString.match(/(?:[^\s"]+|"[^"]*")+/g);
};

String.prototype.generateKeywordArray = function () {
    var inputString = this.removeMultipleWhitespaces();
    inputString = inputString.toLocaleLowerCase();

    // Generate array removing all characters except alphanumeric and apostrophes
    return inputString.match(/[a-zA-Z\d']+/g);
};

String.prototype.generatePhoneNumber = function () {
    var phoneNumber = this.replace(/[^0-9\.]+/g, '');
    phoneNumber = parseInt(phoneNumber, 10);

    if (!isNaN(phoneNumber)) {
        phoneNumber = phoneNumber.toString();
        switch (phoneNumber.length) {
            case 5:
                phoneNumber = '231-' + phoneNumber.substring(1, 5);
                break;
            case 7:
                phoneNumber = phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3, 7);
                break;
            case 10:
                phoneNumber = '(' + phoneNumber.substring(0, 3) + ') ' + phoneNumber.substring(3, 6) + '-' +
                    phoneNumber.substring(6, 10);
                break;
            default:
                return false;
        }
        return phoneNumber;
    }
    return false;
};

String.prototype.removeMultipleWhitespaces = function () {
    return this.replace(/\s\s+/g, ' ');
};

String.prototype.validateEmail = function () {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this);
};
