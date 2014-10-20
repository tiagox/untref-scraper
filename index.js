var Nightmare = require('nightmare'),
  fs = require('fs');

var nightmare = new Nightmare();

nightmare
  .goto('http://170.210.60.144/alumnos/')
  .type('input[name="txtdoc"]', 'dni')
  .type('input[name="txtleg"]', 'legajo')
  .click('input[name="Ingreso"]')
  .wait()
  .goto('http://170.210.60.144/alumnos/UTF_Analitico.asp')
  .wait()
  .evaluate(function () {
      var rows = document.querySelectorAll(
        'td.Estilo4 > table > tbody > tr > td > table:nth-of-type(3) > tbody > tr'),
        map = function(){
          var args = [].slice.call(arguments, 1);
          return Array.prototype.map.apply(arguments[0], args);
        };

      return map(rows, function (row) {
        return  '"' + map(row.children, function (field) {
          return field.innerText;
        }).join('","') + '"';
      }).join('\n');
    }, function (res) {
      fs.writeFile('./analitico.csv', res, function(err) {
        console.log((err) ? err : 'The file was saved!');
      });
    })
  .run();
