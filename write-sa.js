import fs from 'fs';

const serviceAccount = {
  "type": "service_account",
  "project_id": "birthday-anniversary-app-2136",
  "private_key_id": "90c3e53db7e35d7c3f6558b6644362b3a1a69c8a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDGGxP1Fbfd1Ddz\nkACUQa5C8Rw/bI3BdxhH3hzHKzm2Jc8FactcZHF7r4mamVrcDLd3j6v4E0TrjT7p\nL2iIqmk20t7jkxmWXiqqSMeXJsgXlc4EPqB0pKMKdDfHlHYKjUiErpfOekzJksWM\nWF8aYYCEqk5HUawhayVsxBBEH9LVcaAWPA/V6HaK7//Uhu7upTgOIPQSuvno2h9r\nFlfzeBPdPqOMV63VbMJc4dg4tGmj07xf4I6cdxDE5xpd/KuXij2vArf0BEXwYM42\nWtfw1eWLxOMimYUGoOz95S9eNNLIGwrlDgraakfqa+569gq3oBvGZsg4Bc9iqOrV\nvst3ysopAgMBAAECggEAEl6eaiJ6azJrdebLdvPkMcbjxKnPNzpQ4REigAFtF4vH\n94uI1Odncn2jd9dyimcPeCG1Y4p94I23YK4Jtmp+2RuSmW2heMUAlcur3kM1WKKG\nePRJsqc1ixmdtn74tx/EsrDx2K6Ugjh+4vWq0+ponWShX5GeMXcbAEvp6jc9OJdn\nxjRYrOj+jrLh/zQg6UJKOTSA1b9i5Lz3CNrGgqVfEoTBUSREBvQQT8401kv44zU6\n/kuY+BlnkYBzAqLDr5WOu9v+dk+DGrHSRcQmlWBnFGuu+jCqBT0ynxz76/iJpdih\nZ0UzxXF1DiJT3DmWDOZh2voXj0cUap6ypZggNgbNhQKBgQD0aaupOJ+8tgNSTMAH\nQG/+sRVJ1tdAMg/L/H6NOHT4wKnR+LvFtixGhjtTpyPO2GPIT7ctbVQjyrsyMB1W\qvfdu67F3M8WJzNwkz2T7rjVegWksMSo4pieqQWgvrnN0QWyAwvqsbkU4Fihf/O+\nC+POwoRukk+IO+8LGp17XJY5BwKBgQDPf2ZdNaAztx9z2y5nY+5jzj/xFFLpROMw\nmfLaYjckuJTTWalA6iCKgPyDHXk3icIBpc+DfM0WOPsPsJlYyPcK7C2OJ6NULI5B\nzykL1P9Cq48pTX3nI8U/R4kyfsV44UAYOTnQg3bVc9Z4jsSzGdW2kWNGgarVIPMy\nPlzCzyAHTwKBgQC88CsZR4KEORfcOSSA9pkdA/t29zOyloCLqgaSWMBjw1wDywos\nzqTvZ7jY8+3EapbINIdgAJH4kTGgnH0xkDzIFdwHbKhRccBcGBaUEwijTg6qv1Nn\nUrO0guis2IN9zUrO0guis2IN9zUVf1OcTaIuwzbT2M5lSopJaNRh2+Xet0tb5eHug73PZZQKBgQCf\nxylqwt1ulSc6Dl/oK1IpNmuUVyMVDv+msBUKRrDRrPSk3pjvLJoMLRDEYdCyjHiA\nzk5BoLtHzm69AS7D6FQa7AyUNz+UlI6ibEPeIZDBpNujYVF+x9OeS5aA9I9Y6pJx\nVLeJMYIzEXTn9n/Orikb4U5Bv51tamb6nHzPYbD3DwKBgQCruurHm5lV1hG8gNhE\nwGRA9UtRB920XyZwu6aHdx6tCCSyPyjMZ8CymTFYNvn6gGLGAqlq7j30n64hj8d9\nj5eouNOZO1axQcqXT9/IrzDWF8N6AvVKYGwGh8NuoD68xsubLy1/gkv5Aul6aSGd\nVUsSjOJwBCq6HKz8edefVt/xiw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@birthday-anniversary-app-2136.iam.gserviceaccount.com",
  "client_id": "115258187815498819230",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40birthday-anniversary-app-2136.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

fs.writeFileSync('service-account.json', JSON.stringify(serviceAccount, null, 2));
console.log('Successfully written service-account.json');
