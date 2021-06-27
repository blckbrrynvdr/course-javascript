function inherit(child, parent) {
  /* in New JS */
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
  child.prototype.parent = parent;

  /* на базовом уровне
  const Temp = function () {};
  Temp.prototype = parent.prototype;
  child.prototype = new Temp();
  */

  /*
    наследуем в потомок свойства от родителя
    child.prototype = {
        // тут собственные методы
        setAge: function () {},
        __proto__: {
            // тут методы из родителя
            // если в потомке не будет найдено каких-то методов
            // то поиск будет производиться в родителе
            constructor: File,
            setName: function () {},
            getName: function () {},
        }
    }*/
}

const F = function (name) {
  this.setName(name);
};

const F2 = function (name, age) {
  this.setName(name);
  this.setAge(age);
};

F.prototype.setName = function (name) {
  this.name = name;
};

F.prototype.getName = function () {
  return this.name;
};

inherit(F2, F);

F2.prototype.setAge = function (age) {
  this.age = age;
};

F2.prototype.getAge = function () {
  return this.age;
};

/* Переопределение свойств */
F2.prototype.setName = function (name) {
  this.constructor.parent.prototype.setName.call(this, name);
  // F.prototype.setName().call(this, name);
  // this.__proto__.__proto__.setName.call(this, name);
  // F2.parent.setName.call(this, name);

  console.log('новое имя установлено');
};

const obj1 = new F('Сергей');
const obj2 = new F2('Андрей', 30);

// чему в итоге будет равен obj2, экземпляр F2
/*
obj2 = {
    name: 'Andrey',
    age: 30,
    __proto__: 
        setAge: function () {},
        getAge:  function(){},
            __proto__: {
                // тут методы из родителя
                // если в потомке не будет найдено каких-то методов
                // то поиск будет производиться в родителе
                constructor: File,
                setName: function () {},
                getName: function () {},
            }
}
*/

console.log(obj1.getName());
console.log(obj2.getName(), obj2.getAge());
