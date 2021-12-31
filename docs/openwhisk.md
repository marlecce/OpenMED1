# Installazione

La documentazione è qui: https://openwhisk.apache.org/documentation.html#openwhisk_deployment

## Pre-requisiti

- Docker
- Java
- Node
- Openwhisk CLI aka "wsk"

Attenzione in particolare alla versione di java: attualmente è compatibile la 1.8 dell'Oracle JDK. Noi abbiamo testato la versione 1.8.0_291 in ambiente ubuntu.

Eseguire:

$ git clone https://github.com/apache/openwhisk.git
$ cd openwhisk
$ ./gradlew core:standalone:bootRun

Se tutto funziona, viene aperta una finestra del browser sul playground di esempio.

Di default l'ambiente di Openwhisk mette a disposizione un utente guest che si può usare per fare i primi test. Per visualizzare lo username e la pwd di default lanciare il seguente comando:

wsk property get --auth

compare qualcosa come il seguente output:

whisk auth		stringa1:string2

dove string1 è lo username e string2 la pwd da usare nelle chiamate API.

Per visualizzare la configurazione iniziale:

cat ~/.wskprops 

Visualizza qualcosa come:

AUTH=
NAMESPACE=_
APIGW_TENANT_ID=
APIGW_ACCESS_TOKEN=
APIVERSION=v1
APIHOST=http://172.17.0.1:3233

Esempio HTTP


http://172.17.0.1:3233/api/v1/namespaces/guest/actions


esempio CURL

curl -u 23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP http://172.17.0.1:3233/api/v1/namespaces/whisk.system/packages


