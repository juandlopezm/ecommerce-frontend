# playwing — pruebas E2E grabadas (Playwright Codegen)

Carpeta para las pruebas E2E que generes **grabando** con Playwright Codegen. `pytest` las recoge
automáticamente (igual que el resto de `e2e/tests/`).

## Grabar una prueba aquí

Con el backend (`:8000`) y el frontend (`:5173`) corriendo, desde `e2e/`:

```bash
.venv\Scripts\activate
playwright codegen http://localhost:5173 --target python-pytest -o tests/playwing/test_mi_flujo.py
```

- Navega/haz clic: el código aparece en vivo.
- Añade **aserciones** con la barra del Inspector (Assert visibility / text…).
- Al cerrar la ventana queda `tests/playwing/test_mi_flujo.py`. Renómbralo y ejecútalo:

```bash
pytest tests/playwing
```

> Recuerda: graba contra el entorno **local** (no producción), para no crear datos reales.
> El nombre de cada función de prueba que genera el codegen es `test_example`; cámbialo por algo
> descriptivo (p. ej. `test_compra_con_dos_productos`).
