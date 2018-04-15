# Notas

## AngularJS 
web: https://angularjs.org/
versiones: https://code.angularjs.org/


## Componentes de Terceros

### DataPicker

> MALOT, Sebastien. "DateTime Picker · Bootstrap Component." DateTime Picker · Bootstrap. N.p., 3 Mar. 2017. Web. 11 May 2017. <http://www.malot.fr/bootstrap-datetimepicker/>.

## Servidor Web usando nodeJS (https://nodejs.org/es/)
### Módulo http-server
#### Instalación
Ejecutar desde la línea de comando:
```
npm install -g http-server
```
> Observar el modificador '-g' que implica instalación del módulo a nivel global.

luego, cambiar a la carpeta root del sitio y ejecutar:  
```
http-server -c-1
```

## Unit Test
### Jasmine  + Karma
#### Instalación
##### Desde la carpeta root
* npm init
  * se crea el archivo _package.json_ <-- importante para tener la configuración de paquetes _npm_ instalados
* sudo npm install -g karma-cli
* npm install karma karma-jasmine jasmine-core karma-chrome-launcher --save-dev
* npm install karma-spec-reporter --save-dev
#### Configuración
##### En la carpeta root
* crear el archivo _karma.conf.js_ con **karma init**
#### Ejecución
##### Desde la carpeta con el archivo de configuración
* karma start
    - Si se indica instalar el paquete, entonces es necesario ejecutar la Re-Instalación 
#### Re-Instalación de los paquetes de npm
##### _Es necesario cuando se cambia de ramas_  (automatizar)
* npm install       
    - Este comando usa el archivo _package.json_ para determinar los paquetes necesarios



## Commit conventions

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation
> ref: <https://gist.github.com/brianclements/841ea7bffdb01346392c>


## Integration Test (en breve)



