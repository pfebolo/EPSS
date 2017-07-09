# Changelog
Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en la especificación [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
y este proyecto adhiere a [Versionamiento Semántico 2.x.x](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Se agrega la eliminación de una ficha de Interesado

## [0.9.1] - 2017-06-27
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

