
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registrationUsers",
          "summary": "Registration users",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email confirmation link sent"
            },
            "400": {
              "description": "Validation error or user already registered",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/email-confirmation/{code}": {
        "get": {
          "operationId": "AuthController_registrationConfirmation",
          "summary": "Email confirmation",
          "parameters": [
            {
              "name": "code",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Email successfully verified"
            },
            "400": {
              "description": "Link is invalid or expired",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-link": {
        "post": {
          "operationId": "AuthController_refreshConfirmationLink",
          "summary": "Refresh confirmation link",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationEmailResendingDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Link updated"
            },
            "400": {
              "description": "Bad request"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_loginUser",
          "summary": "user authorization",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "accessToken": {
                        "type": "string",
                        "description": "Access token for authentication."
                      },
                      "profile": {
                        "type": "boolean",
                        "description": "Indicates if a profile exists."
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Validation error or user already registered",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Invalid credentials"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "summary": "Password recovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailResendingDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Even if the current email address is not registered (to prevent the user's email from being detected)"
            },
            "400": {
              "description": "If not valid email (for example, 222^gmail.com)",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_createNewPassword",
          "summary": "Creating a new password",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "If the code is valid and the new password is accepted"
            },
            "400": {
              "description": "If the input data has incorrect values (due to incorrect password length) or the RecoveryCode is incorrect or expired"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "User logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            },
            "400": {
              "description": "If the input data has incorrect values (due to incorrect password length) or the RecoveryCode is incorrect or expired"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_updateRefreshToken",
          "summary": "Generate new pair of access and refresh tokens",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken in body and JWT refreshToken in cookie "
            },
            "400": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/users": {
        "get": {
          "operationId": "UsersController_getAllUsers",
          "summary": "Get all users",
          "parameters": [],
          "responses": {
            "200": {
              "description": "All users"
            }
          },
          "tags": [
            "Users"
          ]
        }
      },
      "/delete-all-data": {
        "delete": {
          "operationId": "TestingController_clearAllData",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/users/profiles/profile": {
        "get": {
          "operationId": "UsersProfilesController_getUserProfile",
          "summary": "Get user profile",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UsersProfilesDto"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Profiles"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/users/profiles/save-profileInfo": {
        "post": {
          "operationId": "UsersProfilesController_saveUsersProfiles",
          "summary": "Create profile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UsersProfilesDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "User saved"
            },
            "400": {
              "description": "Validation error",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "errorsMessages": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "message": {
                              "type": "string"
                            },
                            "field": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Profiles"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/users/profiles/save-avatar": {
        "post": {
          "operationId": "UsersProfilesController_saveAvatar",
          "summary": "Upload avatar",
          "parameters": [],
          "responses": {
            "204": {
              "description": "Avatar create"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Profiles"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "Instagram",
      "description": "The Instagram API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "schemas": {
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "minimum": 6,
              "maximum": 30
            },
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string",
              "minimum": 6,
              "maximum": 20
            }
          },
          "required": [
            "login",
            "email",
            "password"
          ]
        },
        "RegistrationEmailResendingDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "EmailResendingDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "minimum": 6,
              "maximum": 20
            },
            "recoveryCode": {
              "type": "string"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "UsersProfilesDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "minimum": 6,
              "maximum": 30
            },
            "firstName": {
              "type": "string",
              "maximum": 50
            },
            "lastName": {
              "type": "string",
              "maximum": 50
            },
            "dateOfBirthday": {
              "type": "string"
            },
            "city": {
              "type": "string",
              "maximum": 50
            },
            "userInfo": {
              "type": "string",
              "maximum": 200
            }
          },
          "required": [
            "login",
            "firstName",
            "lastName",
            "dateOfBirthday",
            "city",
            "userInfo"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
