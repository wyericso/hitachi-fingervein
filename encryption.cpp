#include <node_api.h>
#include "camellia_es.h"

// typedef unsigned int KEY_TABLE_TYPE[68];      # defined in camellia_es.h
typedef unsigned char BYTE;
KEY_TABLE_TYPE m_uKttWork {};

napi_value Ekeygen(napi_env env, napi_callback_info info) {

    BYTE m_byCurrentWorkKey[16] {};         // Hard-coded key as 0x00 x 16.

    Camellia_Ekeygen_es(128, m_byCurrentWorkKey, m_uKttWork);

    napi_value result {};

    return result;
}

napi_value Decrypt(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc];

    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Get data and data length.

    void *pBuff;
    size_t length;

    napi_get_buffer_info(env, argv[0], &pBuff, &length);

    // Decrypt data.

    BYTE pComm[1024] {};

    for (size_t i = 0; i < length; i+=16) {
        Camellia_DecryptBlock_es(128, (BYTE *) (pBuff) + i, m_uKttWork, pComm + i);
    }

    // Consolidate output and return.

    napi_value decrypted;
    napi_create_buffer_copy(env, length, pComm, nullptr, &decrypted);
    return decrypted;
}

napi_value Encrypt(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[argc];

    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Get data and data length.

    void *pComm;
    size_t length;

    napi_get_buffer_info(env, argv[0], &pComm, &length);

    // Encrypt data.

    BYTE pBuff[1024] {};

    for (size_t i = 0; i < length; i+=16) {
        Camellia_EncryptBlock_es(128, (BYTE *) (pComm) + i, m_uKttWork, pBuff + i);
    }

    // Consolidate output and return.

    napi_value encrypted;
    napi_create_buffer_copy(env, length, pBuff, nullptr, &encrypted);
    return encrypted;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_value fn;

    napi_create_function(env, NULL, 0, Ekeygen, NULL, &fn);
    napi_set_named_property(env, exports, "Ekeygen", fn);

    napi_create_function(env, NULL, 0, Decrypt, NULL, &fn);
    napi_set_named_property(env, exports, "Decrypt", fn);

    napi_create_function(env, NULL, 0, Encrypt, NULL, &fn);
    napi_set_named_property(env, exports, "Encrypt", fn);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);
