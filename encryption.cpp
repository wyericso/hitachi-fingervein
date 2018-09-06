#include <node_api.h>
#include "camellia_es.h"
#include <iostream>

// typedef unsigned int KEY_TABLE_TYPE[68];      # defined in camellia_es.h
typedef unsigned char BYTE;
KEY_TABLE_TYPE m_uKttWork {};

napi_value Ekeygen(napi_env env, napi_callback_info info) {

    BYTE m_byCurrentWorkKey[16] {};         // Hard-coded key as 0x00 x 16.

    Camellia_Ekeygen_es(128, m_byCurrentWorkKey, m_uKttWork);

    napi_value result;
    napi_create_array(env, &result);

    napi_value number;
    for (int i = 0; i < static_cast<int>(sizeof(m_uKttWork) / sizeof(m_uKttWork[0])); i++) {
        napi_create_uint32(env, m_uKttWork[i], &number);
        napi_set_element(env, result, i, number);
    }

    return result;
}

napi_value Decrypt(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[argc];

    napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    // Get m_uKttWork.

    napi_value elem;

    for (uint32_t i = 0; i < sizeof(m_uKttWork) / sizeof(m_uKttWork[0]); i++) {
        napi_get_element(env, argv[0], i, &elem);
        napi_get_value_uint32(env, elem, m_uKttWork + i);
    }

    // Get data and data length.

    void *buf;
    size_t length;

    napi_get_buffer_info(env, argv[1], &buf, &length);

    // Decrypt data.

    BYTE pComm[1024] {};

    for (size_t i = 0; i < length; i+=16) {
        Camellia_DecryptBlock_es(128, (BYTE *) (buf + i), m_uKttWork, pComm + i);
    }

    // Consolidate output and return.

    napi_value decrypted;

    napi_create_buffer_copy(env, length, pComm, nullptr, &decrypted);

    return decrypted;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_value fn;

    napi_create_function(env, NULL, 0, Ekeygen, NULL, &fn);
    napi_set_named_property(env, exports, "Ekeygen", fn);

    napi_create_function(env, NULL, 0, Decrypt, NULL, &fn);
    napi_set_named_property(env, exports, "Decrypt", fn);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);
