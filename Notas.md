# Notas

## Componentes de Terceros

### DataPicker

> MALOT, Sebastien. "DateTime Picker · Bootstrap Component." DateTime Picker · Bootstrap. N.p., 3 Mar. 2017. Web. 11 May 2017. <http://www.malot.fr/bootstrap-datetimepicker/>.



## Unit Test
### Jasmine  + Karma
#### Instalación
##### Desde la carpeta root
* npm init
  * se crea el archivo _package.json_ <-- importante para tner la configuración de paquetes _npm_ instalados
* sudo npm install -g karma-cli
* npm install karma karma-jasmine jasmine-core karma-chrome-launcher --save-dev
* npm install karma-spec-reporter --save-dev
#### Configuración
##### En la carpeta root
* crear el archivo _karma.conf.js_ con **karma init**
#### Ejecución
##### Desde la carpeta con el archivo de configuración
* karma start
    - Si es indica instalar el paquete, entonces es necesario ejecutar la Re-Instalación 
#### Re-Instalación de los paquetes de npm
##### _Es necesario cuando se cambia de ramas_  (automatizar)
* npm install       
    - Este comando usa el archivo _package.json_ para determinar los paquetes necesarios



## Integration Test (en breve)

