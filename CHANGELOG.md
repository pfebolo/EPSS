# Changelog
Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en la especificación [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
y este proyecto adhiere a [Versionamiento Semántico 2.x.x](http://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2017-09-19
### Added
- Se agrega funcionalidad "Cancelar" en lista de inscriptos, que retrotrae al inscripto a su estado de Interedado.
- Se mejora navegabilidad entre listas y fichas de edición de Interesados e Inscriptos.

### Fixed
- Se corrige en la edición de inscriptos los datos de año y nmestre.
- Se corrige en la edición de inscriptos los datos de modalidad y turno.

## [0.14.0] - 2017-09-12
### Added
- Se actualiza AngulaJS a version 1.6.x
- Se oculta PIN de eliminación de interesados, al ingresarlo, simil password.

### Fixed
- Se corrige detección de duplicado en edición de interesados.

## [0.13.0] - 2017-09-05
### Added
- Se agrega exportación a Excel de Legajos.
- Se mejora la exportación a Excel de Inscriptos.
- Se agrega detección de duplicado en el alta de interesados.


## [0.12.0] - 2017-08-22
### Added
- Se agrega marca de envío de mail de bienvenida a Inscriptos

## [0.11.0] - 2017-08-02
### Added
- Se agrega el campo observación a los eventos.
- Se modifica la lista de invitados a un evento colocando Teléfono y e-Mail, también se iconiza la observación.
- Se mejora la indicación de asistencia a un evento en la lista de eventos asociados a un interesado.
- Se mejora la búsqueda en Interesados y Legajos para contemplar la concatenación de Apellido y Nombre.
- Se mejora la recarga de la lista al regresar de una edición/creación de interesado, filtra por el interesado creado/editado.
- Se agrega el campo 'Medio de Contacto' a la ficha de interesados.
- Se agrega filtro por 'seguimiento' en la lista de interesados, al clickear sobre el banderin del título.

### Fixed
- Se arregla la busqueda de valores númericos en Legajo.

## [0.10.0] - 2017-07-12
### Added
- Se agrega la eliminación de una ficha de Interesado.
- Se agrega eliminación de interesado, con PIN de confirmación.
- Se agrega reglas de duplicación de interesados, y se destacan en la lista correspondiente.
- Se mejora la busqueda permitiendo busquedas insensitivas en lista de interesados y de Legajos.

## [0.9.1] - 2017-07-05
### Added
- Archivo CHANGELOG.md que se usará para documentar el historial de cambios, basado en el proyecto de código abierto CHANGELOG.

### Fixed
- Se corrige problema de urlEncoding con cadenas de caracteres que comienzan % pero no son caracteres codificados (regEx: /%([^A-F0-9]|[A-F0-9][^A-F0-9])/gi)

## [0.9.0] - 2017-06-27
### Added
- En la vista de eventos se exponen los eventos pasados, presentes (del día) y futuros con diferentes colores.
- No se permite editar eventos con más de 7 días de vencidos.
- No se permite borrar eventos vencidos.
- No se permite borrar invitados a los eventos, si el evento está vencido.
- No se permite cambiar el estado de asistencia de un interesado, luego de 7 días de vencido el evento.
- No se permite cambiar el estado de asistencia de un interesado, en los eventos futuros.

### Changed
- Se cambia la forma de búsqueda de interesados, permitiendo la búsqueda en el universo completo de datos.
- Se mejora la velocidad de búsqueda de interesados en la vista de interesados.

### Removed
- Se elimina la búsqueda por rango de fechas en la vista de Interesados.

### Fixed
- Se corrige la forma de determinar el tipo de número de teléfono, fijo o Celular, al inscibir a un interesado.
