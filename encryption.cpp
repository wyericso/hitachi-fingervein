#include <node_api.h>
#include "camellia_es.h"
#include <iostream>

napi_value SendEncryptionKey(napi_env env, napi_callback_info info) {
//    typedef unsigned int KEY_TABLE_TYPE[68];      # defined in camellia_es.h
    typedef unsigned char BYTE;

    BYTE m_byCurrentWorkKey[16] {};         // Hard-coded key as 0x00 x 16.
    KEY_TABLE_TYPE m_uKttWork {};

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
    size_t argc = 2;
    napi_value argv[2];

    status = napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);

    napi_value result = argv[1];

//    void** m_uKttWork;
//    size_t length;

//    status = napi_get_arraybuffer_info(env, argv[0], m_uKttWork, &length);
//    std::cout << length << "\n";

    return result;
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
