
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
      "/api/v1": {
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
      "/api/v1/auth/registration": {
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
              "description": "List of possible errors:<br>1.User with this email is already registered<br> 2.Wrong length\n",
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
      "/api/v1/auth/email-confirmation/{code}": {
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
            },
            {
              "name": "status",
              "required": true,
              "in": "path",
              "schema": {
                "type": "boolean"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Email successfully verified"
            },
            "400": {
              "description": "Incorrect confirmation code",
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
      "/api/v1/auth/refresh-link": {
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
              "description": "List of possible errors:<br>1.Bad request<br>2.Invalid email",
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
      "/api/v1/auth/login": {
        "post": {
          "operationId": "AuthController_loginUser",
          "summary": "User authorization",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailDto"
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
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/v1/auth/password-recovery": {
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
              "description": "List of possible errors:<br>1.Invalid email address<br>2.Incorrect recaptcha code",
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
      "/api/v1/auth/new-password": {
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
              "description": "List of possible errors:<br>1.Wrong length newPassword<br> 2.Incorrect confirmation code"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/v1/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "User logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            },
            "401": {
              "description": "The JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/v1/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_updateRefreshToken",
          "summary": "Generate new pair of access and refresh tokens",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken in body and JWT refreshToken in cookie ",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "accessToken": {
                        "type": "string",
                        "description": "Access token for authentication."
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "The JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/v1/auth/me": {
        "get": {
          "operationId": "AuthController_getInfoAboutMe",
          "summary": "Returns user data",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserEntity"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/auth/google": {
        "post": {
          "operationId": "AuthController_getAccessTokenForGoogle",
          "summary": "Google OAuth registration and login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OauthCodeDto"
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
            "204": {
              "description": "Email sent"
            },
            "400": {
              "description": "Bad auth code",
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
      "/api/v1/auth/merge/google": {
        "post": {
          "operationId": "AuthController_mergeAccountsForGoogle",
          "summary": "Merge accounts for google",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationConformationDto"
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
              "description": "Incorrect confirmation code",
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
      "/api/v1/auth/github": {
        "post": {
          "operationId": "AuthController_getAccessTokenForGithub",
          "summary": "Github OAuth registration and login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/OauthCodeDto"
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
            "204": {
              "description": "Email sent"
            },
            "400": {
              "description": "List of possible errors:<br>1.Bad auth code<br> 2.Bad verification code<br> 3. Email not specified or private",
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
      "/api/v1/auth/merge/github": {
        "post": {
          "operationId": "AuthController_mergeAccountsForGithub",
          "summary": "Merge accounts for github",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegistrationConformationDto"
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
              "description": "Incorrect confirmation code",
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
      "/api/v1/users/{userId}": {
        "delete": {
          "operationId": "UsersController_getAllUsers",
          "summary": "Delete user for test",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "User deleted"
            }
          },
          "tags": [
            "Users"
          ],
          "security": [
            {
              "basic": []
            }
          ]
        }
      },
      "/api/v1/delete-all-data": {
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
      "/api/v1/users/profiles/profile": {
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
                    "$ref": "#/components/schemas/UsersProfilesEntity"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
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
        },
        "delete": {
          "operationId": "UsersProfilesController_deleteProfile",
          "summary": "Delete profile",
          "parameters": [],
          "responses": {
            "204": {
              "description": "Profile deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
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
      "/api/v1/users/profiles/save-profileInfo": {
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
              "description": "List of possible errors:<br>1.Wrong length.<br>2.Invalid date format. Please use the format dd-mm-yyyy.",
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
      "/api/v1/users/profiles/save-avatar": {
        "post": {
          "operationId": "UsersProfilesController_saveAvatar",
          "summary": "Upload avatar. \"fieldName\" must be \"avatar\"",
          "parameters": [],
          "responses": {
            "204": {
              "description": "Avatar created"
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
      "/api/v1/posts/post": {
        "post": {
          "operationId": "PostsController_createPosts",
          "summary": "Create post. \"fieldName\" must be \"posts\"",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DescriptionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Post created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostEntityWithImage"
                  }
                }
              }
            },
            "400": {
              "description": "List of possible errors:<br>1.Wrong length<br>2.More than 10 photos",
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
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/posts/post/{postId}": {
        "put": {
          "operationId": "PostsController_updatePost",
          "summary": "Update description for post",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DescriptionDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Post updated"
            },
            "400": {
              "description": "Wrong length",
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
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "PostsController_getPost",
          "summary": "Get info for post",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostEntityWithImage"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "PostsController_deletePost",
          "summary": "Delete post",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "Post deleted"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Posts"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/posts/{userId}": {
        "get": {
          "operationId": "PostsController_getPostsCurrentUser",
          "summary": "Get post for current user",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "What field to sort by",
              "schema": {
                "default": "createdAt"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string",
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "description": "Page number to return",
              "schema": {
                "default": 1,
                "type": "integer"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "description": "Number of elements to return",
              "schema": {
                "default": 9,
                "type": "integer"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostQueryType"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            }
          },
          "tags": [
            "Posts"
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
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        },
        "basic": {
          "type": "http",
          "scheme": "basic"
        }
      },
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
        "EmailDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "EmailResendingDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "recaptchaValue": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "recaptchaValue"
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
        "UserEntity": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "User id"
            },
            "login": {
              "type": "string",
              "description": "User login"
            },
            "email": {
              "type": "string",
              "description": "User email"
            }
          },
          "required": [
            "id",
            "login",
            "email"
          ]
        },
        "OauthCodeDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string"
            }
          },
          "required": [
            "code"
          ]
        },
        "RegistrationConformationDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string"
            },
            "status": {
              "type": "boolean"
            }
          },
          "required": [
            "code",
            "status"
          ]
        },
        "UsersProfilesEntity": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "User id"
            },
            "login": {
              "type": "string",
              "description": "User login"
            },
            "firstName": {
              "type": "string",
              "description": "User first name"
            },
            "lastName": {
              "type": "string",
              "description": "User last name"
            },
            "dateOfBirthday": {
              "type": "string",
              "description": "User date of birthday"
            },
            "city": {
              "type": "string",
              "description": "User city"
            },
            "userInfo": {
              "type": "string",
              "description": "User info"
            },
            "photo": {
              "type": "string",
              "description": "User avatar"
            }
          },
          "required": [
            "userId",
            "login",
            "firstName",
            "lastName",
            "dateOfBirthday",
            "city",
            "userInfo",
            "photo"
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
        },
        "DescriptionDto": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string",
              "maximum": 500
            }
          },
          "required": [
            "description"
          ]
        },
        "PostsImagesEntityForSwagger": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "Url image"
            }
          },
          "required": [
            "url"
          ]
        },
        "PostEntityWithImage": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Post id"
            },
            "userId": {
              "type": "string",
              "description": "UserId"
            },
            "description": {
              "type": "string",
              "description": "Description post"
            },
            "createdAt": {
              "type": "string",
              "description": "Created Date"
            },
            "images": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PostsImagesEntityForSwagger"
              }
            }
          },
          "required": [
            "id",
            "userId",
            "description",
            "createdAt",
            "images"
          ]
        },
        "PostQueryType": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number",
              "description": "Number of items sorted"
            },
            "page": {
              "type": "number",
              "description": "Number of pages"
            },
            "pageSize": {
              "type": "number",
              "description": "Page Size"
            },
            "totalCount": {
              "type": "number",
              "description": "Total items"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PostEntityWithImage"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
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
