// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/admin/demote": {
            "post": {
                "description": "Demotes an admin to regular user role (requires root_admin privileges)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "admin"
                ],
                "summary": "Demote admin to user role",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Bearer token",
                        "name": "Authorization",
                        "in": "header",
                        "required": true
                    },
                    {
                        "description": "Admin ID to demote",
                        "name": "input",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.DemoteToUserRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Admin demoted to user successfully",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "400": {
                        "description": "Invalid admin ID format",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "401": {
                        "description": "Unauthorized - requires root_admin privileges",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "403": {
                        "description": "Forbidden - cannot demote root_admin",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/admin/metrics": {
            "get": {
                "description": "Returns system metrics and statistics (requires admin or root_admin privileges)",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "admin"
                ],
                "summary": "Get system metrics",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Bearer token",
                        "name": "Authorization",
                        "in": "header",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "System metrics",
                        "schema": {}
                    },
                    "401": {
                        "description": "Unauthorized - requires admin privileges",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "403": {
                        "description": "Forbidden - insufficient permissions",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/admin/promote": {
            "post": {
                "description": "Promotes a regular user to admin role (requires admin or root_admin privileges)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "admin"
                ],
                "summary": "Promote user to admin role",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Bearer token",
                        "name": "Authorization",
                        "in": "header",
                        "required": true
                    },
                    {
                        "description": "User ID to promote",
                        "name": "input",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.PromoteToAdminRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User promoted to admin successfully",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "400": {
                        "description": "Invalid user ID format",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "401": {
                        "description": "Unauthorized - requires admin privileges",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "403": {
                        "description": "Forbidden - insufficient permissions",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/admin/users": {
            "get": {
                "description": "Returns a list of all users in the system (requires admin or root_admin privileges)",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "admin"
                ],
                "summary": "List all users",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Bearer token",
                        "name": "Authorization",
                        "in": "header",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "List of users",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.User"
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - requires admin privileges",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "403": {
                        "description": "Forbidden - insufficient permissions",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/admin/users/delete": {
            "post": {
                "description": "Deletes a user or admin account (admin can delete users, root_admin can delete both users and admins)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "admin"
                ],
                "summary": "Delete user or admin",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Bearer token",
                        "name": "Authorization",
                        "in": "header",
                        "required": true
                    },
                    {
                        "description": "User ID to delete",
                        "name": "input",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.DeleteUserRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User deleted successfully",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "400": {
                        "description": "Invalid user ID format",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "401": {
                        "description": "Unauthorized - requires admin privileges",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "403": {
                        "description": "Forbidden - insufficient permissions or cannot delete root_admin",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/auth/confirm": {
            "get": {
                "description": "Activates a user account using the confirmation token from email",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Confirm user account",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Confirmation token from email",
                        "name": "token",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Account activation success message",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "400": {
                        "description": "Invalid token, expired token, or already confirmed account",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/auth/login": {
            "post": {
                "description": "Authenticates user and returns JWT tokens in HTTP-only cookies",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Log in a user",
                "parameters": [
                    {
                        "description": "Email and password",
                        "name": "input",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.LoginRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Login successful message",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "400": {
                        "description": "Invalid input or missing fields",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "401": {
                        "description": "Invalid credentials or account not confirmed",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/auth/password-reset-confirm": {
            "post": {
                "description": "Sets a new password using the provided reset token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Reset password",
                "parameters": [
                    {
                        "description": "Reset token and new password",
                        "name": "input",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.ResetPasswordRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Password reset success message",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResetPasswordResponse"
                        }
                    },
                    "400": {
                        "description": "Invalid token, expired token, or invalid password format",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/auth/password-reset-request": {
            "post": {
                "description": "Sends password reset instructions to the provided email address",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Request password reset",
                "parameters": [
                    {
                        "description": "Email address",
                        "name": "input",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.RequestResetRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Success message (sent regardless of email existence for security)",
                        "schema": {
                            "$ref": "#/definitions/handlers.RequestResetResponse"
                        }
                    },
                    "400": {
                        "description": "Invalid request format",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/auth/register": {
            "post": {
                "description": "Creates a new user account and sends confirmation email",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Register a new user",
                "parameters": [
                    {
                        "description": "User credentials",
                        "name": "input",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.RegisterRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Registration successful message",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "400": {
                        "description": "Invalid input or missing fields",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/auth/validate": {
            "get": {
                "description": "Validates the access token from cookie and returns user claims",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Validate JWT token from cookie",
                "responses": {
                    "200": {
                        "description": "User claims including user_id, role, and expiresAt",
                        "schema": {
                            "type": "object",
                            "additionalProperties": true
                        }
                    },
                    "401": {
                        "description": "Missing or invalid token",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        },
        "/auth/verify-2fa": {
            "post": {
                "description": "Verifies 2FA code and issues JWT tokens in HTTP-only cookies if valid",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Verify 2FA code for admin",
                "parameters": [
                    {
                        "description": "Email and 2FA code",
                        "name": "input",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/handlers.Verify2FARequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "2FA verification successful",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "400": {
                        "description": "Invalid code or expired code",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/handlers.ResponseMessage"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "handlers.DeleteUserRequest": {
            "type": "object",
            "properties": {
                "userId": {
                    "type": "string"
                }
            }
        },
        "handlers.DemoteToUserRequest": {
            "type": "object",
            "properties": {
                "adminId": {
                    "type": "string"
                }
            }
        },
        "handlers.LoginRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        },
        "handlers.PromoteToAdminRequest": {
            "type": "object",
            "properties": {
                "userId": {
                    "type": "string"
                }
            }
        },
        "handlers.RegisterRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        },
        "handlers.RequestResetRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                }
            }
        },
        "handlers.RequestResetResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "handlers.ResetPasswordRequest": {
            "type": "object",
            "properties": {
                "newPassword": {
                    "type": "string"
                },
                "token": {
                    "type": "string"
                }
            }
        },
        "handlers.ResetPasswordResponse": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "handlers.ResponseMessage": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "handlers.Verify2FARequest": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                }
            }
        },
        "models.User": {
            "type": "object",
            "properties": {
                "createdAt": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "failedLoginAttempts": {
                    "type": "integer"
                },
                "id": {
                    "type": "string"
                },
                "is2FAEnabled": {
                    "type": "boolean"
                },
                "isActive": {
                    "type": "boolean"
                },
                "lastFailedLogin": {
                    "type": "string"
                },
                "role": {
                    "$ref": "#/definitions/models.UserRole"
                },
                "updatedAt": {
                    "type": "string"
                }
            }
        },
        "models.UserRole": {
            "type": "string",
            "enum": [
                "user",
                "admin",
                "root_admin"
            ],
            "x-enum-varnames": [
                "RoleUser",
                "RoleAdmin",
                "RoleRootAdmin"
            ]
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8080",
	BasePath:         "/api/v1",
	Schemes:          []string{},
	Title:            "Private Service API",
	Description:      "Admin and user management microservice with role-based access control",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
