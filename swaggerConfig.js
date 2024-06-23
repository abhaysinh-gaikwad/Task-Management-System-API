const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Management API",
            version: "1.0.0",
            description: "APIs for managing tasks and user authentication",
        },
        servers: [
            {
                url:"https://task-management-system-api-y2zj.onrender.com/",
                description: "Development server reander"
            },
            {
                url: "http://localhost:3000",
                description: "Development server locally",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*.js"], // Path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
