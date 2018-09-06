#include <node_api.h>
#include "camellia_es.h"
#include <iostream>

// typedef unsigned int KEY_TABLE_TYPE[68];      # defined in camellia_es.h
typedef unsigned char BYTE;
KEY_TABLE_TYPE m_uKttWork {};

napi_value SendEncryptionKey(napi_env env, napi_callback_info info) {

    BYTE m_byCurrentWorkKey[16] {};         // Hard-coded key as 0x00 x 16.

    Camellia_Ekeygen_es(128, m_byCurrentWorkKey, m_uKttWork);

    napi_status status;
    napi_value result;
    status = napi_create_array(env, &result);

    napi_value number;
    for (int i = 0; i < static_cast<int>(sizeof(m_uKttWork) / sizeof(m_uKttWork[0])); i++) {
        status = napi_create_uint32(env, m_uKttWork[i], &number);
        status = napi_set_element(env, result, i, number);
    }

    return result;
}

napi_value DecryptBlock(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 3;
    napi_value argv[argc];

    status = napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    napi_value result, elem;
    uint32_t number;

    for (uint32_t i = 0; i < sizeof(m_uKttWork) / sizeof(m_uKttWork[0]); i++) {
        status = napi_get_element(env, argv[0], i, &elem);
        status = napi_get_value_uint32(env, elem, m_uKttWork + i);
    }

    void *buf;
    size_t length;
/*
    status = napi_get_buffer_info(env, argv[1], &buf, &length);

    for (size_t i = 0; i < length; i++) {
        std::cout << std::hex << static_cast<unsigned int>(*(BYTE *) (buf + i)) << " ";
    }
    std::cout << "\n";

    BYTE *pComm;

    for ()
*/
    return elem;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, SendEncryptionKey, NULL, &fn);
    status = napi_set_named_property(env, exports, "SendEncryptionKey", fn);

    status = napi_create_function(env, NULL, 0, DecryptBlock, NULL, &fn);
    status = napi_set_named_property(env, exports, "DecryptBlock", fn);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);
