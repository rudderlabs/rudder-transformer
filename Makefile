K8S_CLUSTER_NAME=kind-cluster
KIND_IMAGE_VERSION=kindest/node:v1.21.2

.PHONY: create-cluster
create-cluster:
	kind create cluster --image $(KIND_IMAGE_VERSION) --name $(K8S_CLUSTER_NAME) --config=test/__tests__/data/worker-nodes-kind.yml

.PHONY: setup-kubectl
setup-kubectl:
	kind export kubeconfig --name $(K8S_CLUSTER_NAME)

.PHONY: create-namespace
create-namespace:
	kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml

# This is specific to MacBook with M1 Architecture
.PHONY: setup-docker-mac-net-connect
setup-docker-mac-net-connect:
	brew install chipmk/tap/docker-mac-net-connect
	sudo brew services start chipmk/tap/docker-mac-net-connect

.PHONY: pull-arm-image
pull-arm-image:
	docker pull --platform linux/arm64 $(KIND_IMAGE_VERSION)

.PHONY: install-openfaas
install-openfaas:
	helm repo add openfaas https://openfaas.github.io/faas-netes/
	helm repo update \
		&& helm upgrade openfaas --install openfaas/openfaas \
		--namespace openfaas  \
		--set functionNamespace=openfaas-fn \
		--set basic_auth=false \
		--set generateBasicAuth=false \
		--set ceScaling=true \
		--set async=false \
		--set openfaasImagePullPolicy=IfNotPresent \
		--set gateway.image=ghcr.io/openfaas/gateway:0.23.2 \
		--set faasnetes.image=ghcr.io/openfaas/faas-netes:0.15.2
	kubectl rollout status deploy/gateway --timeout 120s -n openfaas
	kubectl get events -n openfaas
	kubectl get pods -n openfaas

.PHONY: setup-arm
setup-arm: setup-docker-mac-net-connect pull-arm-image create-cluster setup-kubectl create-namespace install-openfaas

.PHONY: setup
setup: create-cluster setup-kubectl create-namespace install-openfaas

.PHONY: destroy
destroy:
	kind delete cluster --name $(K8S_CLUSTER_NAME)

.PHONY: uninstall
uninstall:
	helm uninstall openfaas -n openfaas

.PHONY: test
test:
	kubectl port-forward service/gateway-external 8080:8080 -n openfaas & \
	npm run test:ut:integration:ci
