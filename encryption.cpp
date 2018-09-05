#include <node_api.h>
#include "camellia_es.h"
#include <iostream>

napi_value SendEncryptionKey(napi_env env, napi_callback_info info) {
    typedef unsigned char BYTE;

    BYTE m_byCurrentWorkKey[16] {};         // Hard-coded key as 0x00 x 16.
    KEY_TABLE_TYPE m_uKttWork {};

    std::cout << "hihi.\n";

    napi_status status;
    napi_value result;
    status = napi_create_uint32(env, 33, &result);

    return result;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, SendEncryptionKey, NULL, &fn);
    status = napi_set_named_property(env, exports, "SendEncryptionKey", fn);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);
