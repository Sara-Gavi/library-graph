# Guía para subir un CSV a DynamoDB desde Mac (us-west-2)

Cargar un CSV (en mi ejemplo: `books_clean.csv`) en DynamoDB con **3 tablas**:

- **Books** (`bookId` PK)
- **Categories** (`catId` PK)
- **Edges** (`edgeId` PK)

El formato final de **Edges** debe ser:

- `edgeId = <bookId>#<catId>`
- `source = book:<bookId>`
- `target = cat:<catId>`
- `type = PERTENECE_A`

---

## A) Requisitos

- Lab de **VocLabs** iniciado (credenciales temporales activas).
- Mac con **Terminal** y acceso a **conda** (o Python).
- Archivos en tu Mac:
  - `load_csv_to_dynamodb.py`
  - `books_test_10.csv` (o tu CSV final: `books_clean.csv`)
- Región del lab: **us-west-2 (Oregón)**.

---

## B) Los pasos

### 1) Crear tablas en DynamoDB (Consola AWS)

Entrar en **AWS Console → DynamoDB → Tablas → Crear tabla**.

#### Tabla 1: Books
- **Nombre de la tabla:** `Books`
- **Clave de partición:** `bookId` (Cadena/String)
- **Clave de ordenación (sort key):** No (vacía)
- **Configuración:** Predeterminada / Bajo demanda (OK para demo)

#### Tabla 2: Categories
- **Nombre de la tabla:** `Categories`
- **Clave de partición:** `catId` (Cadena/String)
- **Clave de ordenación (sort key):** No (vacía)

#### Tabla 3: Edges
- **Nombre de la tabla:** `Edges`
- **Clave de partición:** `edgeId` (Cadena/String)
- **Clave de ordenación (sort key):** No (vacía)

---

### 2) Credenciales de VocLabs: copiar y guardar en el Mac

#### 2.1) Dónde están
**VocLabs → Cloud Access → sección “AWS CLI”** (aparece un bloque para pegar en `~/.aws/credentials`).

#### 2.2) Qué copiar exactamente
Ojo: **cambia en cada lab**. Copiar **solo** este bloque (los valores los da VocLabs):

```ini
[default]
aws_access_key_id=…
aws_secret_access_key=…
aws_session_token=…
```

**No copiar:** “Remaining session time”, “AccountId”, “UseRole”, etc.

#### 2.3) Pegar en el archivo correcto (Mac)
Abrir Terminal y ejecutar:

```bash
mkdir -p ~/.aws
nano ~/.aws/credentials
```

Pegar el bloque completo (incluido `[default]`) y guardar: **Ctrl + O → Enter → Ctrl + X**

#### 2.4) Configurar región por defecto
Para no tener movidas:

```bash
nano ~/.aws/config
```

Pegar:

```ini
[default]
region=us-west-2
output=json
```

Guardar: **Ctrl + O → Enter → Ctrl + X**

#### 2.5) Comprobar que se guardó
Ejecutar:

```bash
ls -l ~/.aws/credentials
wc -l ~/.aws/credentials
grep -nE '^\[default\]$|^aws_access_key_id=|^aws_secret_access_key=|^aws_session_token=' ~/.aws/credentials
```

---

### 3) Instalar AWS CLI (si no está instalado)

#### 3.1) Comprobar si existe
```bash
aws --version
```

#### 3.2) Si sale “command not found”, instalar con conda
```bash
conda install -c conda-forge awscli -y
```

#### 3.3) Volver a comprobar
```bash
aws --version
```

---

### 4) Verificar que las credenciales funcionan

Ejecutar:

```bash
aws sts get-caller-identity --region us-west-2
```

**Resultado esperado:** un JSON con `Account` y `Arn`.

Si falla, suele ser por **credenciales caducadas** (ver sección 7).

---

### 5) Ejecutar la subida del CSV a DynamoDB (desde el Mac)

#### 5.1) Ir a la carpeta donde están los archivos
Ejemplo si están en Desktop:

```bash
cd ~/Desktop
ls
```

Asegurarse de ver (ajusta nombres según tu caso):

- `load_csv_to_dynamodb.py`
- `books_test_10.csv` o `books_clean.csv`

#### 5.2) Instalar dependencias Python
```bash
python3 -m pip install boto3 pandas
```

#### 5.3) Ejecutar el script
Este comando asume que:
- las tablas ya existen en DynamoDB,
- y que el script usa esos mismos nombres de tabla.

```bash
python3 load_csv_to_dynamodb.py --csv books_clean.csv
```

Salida esperada (ejemplo):

```txt
Carga completada:
{ 'books_written': 10, 'cats_written': X, 'edges_written': 10 }
```

---

### 6) Verificar en DynamoDB (Consola AWS)

**AWS Console → DynamoDB → Tablas → seleccionar tabla → “Explorar elementos”**

#### 6.1) Verificación de Books
Checklist:
- Hay items cargados.
- Cada item tiene: `bookId`, `title`, `author`.

#### 6.2) Verificación de Categories
Checklist:
- `catId` es un *slug* (sin espacios ni tildes).
- `name` es el nombre del género.

#### 6.3) Verificación de Edges
Checklist:
- `edgeId` contiene `#` (formato `bookId#catId`).
- `source` empieza por `book:`.
- `target` empieza por `cat:`.
- `type` es `PERTENECE_A`.

Ejemplo esperado:

```txt
edgeId: a-wizard-of-earthsea-ursula-k-le-guin-1960#fantasy
source: book:a-wizard-of-earthsea-ursula-k-le-guin-1960
target: cat:fantasy
type: PERTENECE_A
```

---

## 7) Sustituir credenciales (cuando caducan)

Las credenciales de VocLabs son **temporales**. Si expiran, hay que reemplazarlas:

- **VocLabs → Cloud Access →** copiar el bloque nuevo de **AWS CLI**.
- En Mac:

```bash
nano ~/.aws/credentials
```

- Borrar el bloque antiguo y pegar el nuevo:

```ini
[default]
aws_access_key_id=…
aws_secret_access_key=…
aws_session_token=…
```

- Guardar y salir.
- Comprobar:

```bash
aws sts get-caller-identity --region us-west-2
```

Si funciona, ya se puede volver a ejecutar el script.
