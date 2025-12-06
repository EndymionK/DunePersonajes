# 🏜️ Dune Personajes - Aplicación Cloud Serverless

[![AWS](https://img.shields.io/badge/AWS-Serverless-orange)](https://aws.amazon.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

Aplicación web completa desplegada en AWS que permite gestionar información de personajes de la saga Dune. Proyecto desarrollado para demostrar conocimientos en Cloud Computing, arquitectura serverless, y buenas prácticas de desarrollo en la nube.

##  Demo en Vivo

- **🖥️ Sitio Web**: [http://dune-personajes-frontend-prod.s3-website-us-east-1.amazonaws.com](http://dune-personajes-frontend-prod.s3-website-us-east-1.amazonaws.com)
- **🔌 API REST**: [https://fzwu5bl246.execute-api.us-east-1.amazonaws.com/prod/personajes](https://fzwu5bl246.execute-api.us-east-1.amazonaws.com/prod/personajes)

## Características

- ✅ **Frontend estático** alojado en Amazon S3
- ✅ **Backend serverless** con AWS Lambda y API Gateway
- ✅ **Base de datos NoSQL** con Amazon DynamoDB
- ✅ **Infraestructura como código** (Serverless Framework, CloudFormation, Terraform)
- ✅ **VPC y networking** configurados con subredes públicas
- ✅ **Seguridad** implementada con IAM roles y Security Groups
- ✅ **Monitoreo** con Amazon CloudWatch (logs, métricas, alarmas)
- ✅ **Arquitectura escalable** y optimizada para costos

## 🏗️ Arquitectura

```
┌─────────────┐
│   Usuarios  │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────┐
│  Amazon S3 (Frontend Static)     │
│  - index.html, app.js, CSS       │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  API Gateway → Lambda Functions  │
│  - CRUD de personajes            │
│  - Procesamiento de eventos      │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Amazon DynamoDB (NoSQL)         │
│  - Tabla de personajes           │
│  - Tabla de logs                 │
└─────────────────────────────────┘
```

## 📂 Estructura del Proyecto

```
DunePersonajes/
├── index.html                  # Página principal
├── assets/
│   ├── app.js                  # Lógica del frontend
│   ├── styles.css              # Estilos
│   └── img/                    # Imágenes de personajes
├── backend/
│   └── lambda/
│       ├── personajes.js       # Lambda para API CRUD
│       ├── s3-trigger.js       # Lambda para eventos S3
│       └── package.json        # Dependencias
├── serverless.yml              # IaC - Serverless Framework
├── cloudformation.yaml         # IaC - CloudFormation
├── cloudformation-backend.yaml # IaC - CloudFormation (Backend)
├── docs/
│   ├── ARQUITECTURA.md         # Descripción de arquitectura
│   └── DOCUMENTO_TECNICO.md    # Documento técnico completo
├── deploy/
│   └── GUIA_DESPLIEGUE.md      # Guía paso a paso
└── README.md                   # Este archivo
```

## 🚀 Despliegue Rápido

### Prerrequisitos

- [AWS CLI](https://aws.amazon.com/cli/) configurado
- [Node.js 18.x](https://nodejs.org/) o superior
- [Serverless Framework](https://www.serverless.com/): `npm install -g serverless`

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/EndymionK/DunePersonajes.git
cd DunePersonajes
```

2. **Instalar dependencias del backend**
```bash
cd backend/lambda
npm install
cd ../..
```

3. **Desplegar backend con Serverless**
```bash
serverless deploy --stage prod
```

4. **Configurar API URL en frontend**

Actualiza la constante `API_URL` en `assets/app.js` con la URL de tu API Gateway.

5. **Desplegar frontend en S3**
```bash
aws s3 mb s3://dune-personajes-frontend-prod
aws s3 sync . s3://dune-personajes-frontend-prod --exclude "backend/*" --exclude "docs/*"
```

## 🛠️ Servicios AWS Utilizados

| Servicio | Propósito | Costo estimado/mes |
|----------|-----------|-------------------|
| **S3** | Hosting frontend estático | $0.03 |
| **Lambda** | Funciones serverless | $0.20 |
| **API Gateway** | REST API endpoints | $0.04 |
| **DynamoDB** | Base de datos NoSQL | $0.02 |
| **CloudWatch** | Logs y monitoreo | $0.25 |
| **EC2** | Instancia de prueba (detenida) | $0.80 |
| **VPC** | Red virtual | $0.00 |
| **IAM** | Gestión de permisos | $0.00 |
| **TOTAL** | | **~$1.34/mes** |

## 📊 API Endpoints

### Base URL
```
https://fzwu5bl246.execute-api.us-east-1.amazonaws.com/prod
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/personajes` | Listar todos los personajes |
| `GET` | `/personajes/{id}` | Obtener un personaje específico |
| `POST` | `/personajes` | Crear nuevo personaje |
| `PUT` | `/personajes/{id}` | Actualizar personaje existente |
| `DELETE` | `/personajes/{id}` | Eliminar personaje |

### Ejemplo de uso

```bash
# Listar personajes
curl https://fzwu5bl246.execute-api.us-east-1.amazonaws.com/prod/personajes

# Crear personaje
curl -X POST https://fzwu5bl246.execute-api.us-east-1.amazonaws.com/prod/personajes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Paul Atreides",
    "planeta": "Arrakis",
    "afiliacion": "Casa Atreides",
    "descripcion": "El Kwisatz Haderach"
  }'
```

## 🧪 Testing Local

### Probar Lambda localmente

```bash
# Instalar serverless-offline
npm install --save-dev serverless-offline

# Iniciar servidor local
serverless offline start

# API estará disponible en http://localhost:3000
```

### Probar frontend localmente

```bash
# Usar cualquier servidor HTTP simple
npx http-server . -p 8080

# O con Python
python -m http.server 8080

# Abrir: http://localhost:8080
```

## 📈 Monitoreo

### CloudWatch Logs

```bash
# Ver logs en tiempo real
aws logs tail /aws/lambda/dune-personajes-api-prod-personajesApi --follow
```

### CloudWatch Metrics

Métricas disponibles en AWS Console → CloudWatch:
- Invocaciones de Lambda
- Errores y throttling
- Latencia de API Gateway
- Capacidad consumida de DynamoDB

### Alarmas configuradas

- ⚠️ Errores en Lambda > 5 en 5 minutos
- ⚠️ Throttling de DynamoDB > 10

## 🔐 Seguridad

### Mejores prácticas implementadas

- ✅ **Principio de menor privilegio** en roles IAM
- ✅ **HTTPS obligatorio** en todas las comunicaciones
- ✅ **CORS configurado** para frontend
- ✅ **Security Groups** con reglas restrictivas
- ✅ **VPC** con aislamiento de red
- ✅ **No hay credenciales hardcodeadas** en el código
- ✅ **Logs centralizados** en CloudWatch

## 📚 Documentación

- 📖 [Guía de Despliegue Completa](deploy/GUIA_DESPLIEGUE.md)
- 🏗️ [Descripción de Arquitectura](docs/ARQUITECTURA.md)
- 📄 [Documento Técnico](docs/DOCUMENTO_TECNICO.md)

## 🎓 Objetivos Académicos Cumplidos

Este proyecto cumple con los siguientes requerimientos:

### ✅ Infraestructura (Módulo 2)
- Instancia EC2 / VM creada
- VPC con subred pública configurada
- Bucket S3 para hosting del frontend
- Roles IAM y seguridad básica implementada

### ✅ Serverless (Módulo 3)
- Funciones Lambda conectadas a API Gateway
- Lambda con trigger de eventos S3
- Flujo completo: formulario → API → almacenamiento → respuesta

### ✅ Monitoreo y Costos
- Métricas configuradas en CloudWatch
- Captura de calculadora de costos incluida
- Presupuesto mensual: ~$1.34 USD

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Andrés Arroyave Carmona**
- **Cesar Daniel Robles Gómez**
- **Andrés Guillermo Toloza**
- **Ferney Alonso Montoya Gallo**

## 🙏 Reconocimientos

- Saga Dune de Frank Herbert
- AWS Documentation
- Serverless Framework
- Comunidad de Cloud Computing

---

⭐ **Si este proyecto te resultó útil, considera darle una estrella en GitHub**

🏜️ **"The spice must flow"** - Dune