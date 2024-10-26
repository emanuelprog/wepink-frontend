#!/usr/bin/env groovy

def getGitBranchName() {
    if (scm.branches[0].name.contains("*/")) {
        return scm.branches[0].name.split("\\*/")[1].trim().toLowerCase()
    }
    return scm.branches[0].name.trim().toLowerCase()
}

node {
    stage('Checkout') {
        checkout scm
    }

    def ambiente
    def imageName
    def configName
    def sshCommand
    def build

    stage('Config Environment') {
        // Checar para ver se é o branch master (Produção).
        branch = getGitBranchName();
        if (branch == 'master') {
            echo 'Configurando Ambiente de Produção.'
            ambiente = 'Prod'
            build = 'prod'
            imageName = 'prod/maiscultura'
            configName = 'producao'
            sshCommand = 'docker stack rm maiscultura; docker stack deploy -c /scripts/docker/app/maiscultura/app.yml maiscultura --with-registry-auth'
        }
        // Checar se é o branch homologacao (Homologação)
        else {
            echo 'Configurando Ambiente de Homologação.'
            ambiente = 'Hom'
            build = 'homolog'
            imageName = 'hom/maiscultura'
            configName = 'homologacao'
            sshCommand = 'if [ $(docker service ls | grep maiscultura | wc -l) -eq 1 ]; ' +
                         'then docker pull repo.campogrande.ms.gov.br/hom/maiscultura:latest ' +
                         '&& docker service update --force --with-registry-auth --image repo.campogrande.ms.gov.br/hom/maiscultura:latest maiscultura; ' +
                         'else docker service create --with-registry-auth ' +
                         '-e SERVICE_NAME="maiscultura-H" '+
                         '--label traefik.enable=true ' +
                         '--label \'traefik.http.routers.maiscultura-h.rule=Host(`maiscultura-h.campogrande.ms.gov.br`)\' ' +
                         '--label traefik.http.routers.maiscultura-h.tls=true ' +
                         '--label traefik.http.routers.maiscultura-h.middlewares=http-errors@file ' +
                         '--label traefik.http.services.maiscultura-h.loadbalancer.server.port=80 ' +
                         '--label traefik.http.services.maiscultura-h.loadbalancer.healthcheck.path=/ ' +
                         '--label traefik.http.services.maiscultura-h.loadbalancer.sticky.cookie=true ' +
                         '--constraint node.role==manager ' +
                         '--constraint node.labels.manager!=ba018l ' +
                         '--network="proxy-net" --replicas=1 --restart-condition="on-failure" ' +
                         '--update-delay 10s --update-parallelism=1 --name maiscultura ' +
                         'repo.campogrande.ms.gov.br/hom/maiscultura:latest; fi'
        }
    }

    docker.image('node:18-alpine').inside('-u root --network=host') {
        stage('Install') {
            sh label: 'Apagando arquivos antigos',
               script: 'rm -rf node_modules && rm -f package-lock.json'
            sh label: 'Instalando ferramentas', 
               script: 'apk --no-cache --allow-untrusted update && apk --no-cache --allow-untrusted add zip curl'            
            sh label: 'Executando npm install e Build', 
               script: 'npm install --force && npm run build:' + build
        }    
    }
    
    def dockerImage
    stage('Build Docker') {
        dockerImage = docker.build(imageName, '--build-arg AMB=' + ambiente.toUpperCase() + ' .')
    }

    stage('Publish Docker') {
        docker.withRegistry('http://repo.campogrande.ms.gov.br') {
            dockerImage.push 'latest'
        }
    }

    stage('Service Create or Update') {
        sshPublisher(publishers: [
            sshPublisherDesc(configName: configName, transfers: [
                sshTransfer(
                    cleanRemote: false,
                    excludes: '',
                    execCommand: sshCommand,
                    execTimeout: 220000,
                    flatten: false,
                    makeEmptyDirs: false,
                    noDefaultExcludes: false,
                    patternSeparator: '[, ]+',
                    remoteDirectory: '',
                    remoteDirectorySDF: false,
                    removePrefix: '',
                    sourceFiles: '')],
                usePromotionTimestamp: false,
                useWorkspaceInPromotion: false,
                verbose: true)]
        )
    }
}
