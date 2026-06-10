Look at the ../rudder-pytransformer/README.md file to understand what we're doing for Python transformations.

The rudder-pytransformer is not live yet but the idea is to get rid of ../openfaas-flask-base and have ../rudder-server 
call rudder-pytransformer directly for Python transformations (without passing through rudder-transformer, thus less
network hops) and achieve better security than OpenFaaS thanks to Kata+Firecracker and a read-only filesystem.

Now we want to explore Kata+Firecracker for this project as well (i.e. rudder-transformer).
We want to get rid of https://github.com/laverdet/isolated-vm (which is in maintenance mode) and have one deployment
per tenant with Kata+Firecracker to guarantee tenants isolation.

This means that rudder-server will call rudder-pytransformer for Python transformations and rudder-transformer for
JavaScript transformations.

# First issue - no routing - we need a solution for both rudder-transformer and rudder-pytransformer

rudder-server already knows the transformation language, but we don't have a routing mechanism for discerning between 
tenants at the moment.

So if we go live with one deployment per tenant/workspace, then rudder-server doesn't know which deployment needs
to forward the transformation to.

I think we have 2 options:
1. rudder-server is somehow able to know which rudder-transformer deployment to hit given the workspaceId of a 
   transformation
   * the logic will reside on the client side (e.g. hashing function, calling a k8s dns service that has the
     workspaceId in its name, something else, etc...)
2. rudder-server is going to hit a dedicated gateway service (much like the OpenFaaS gateway) and then the gateway
   will know which pod to forward the transformation to in k8s

If you think we have more options, explain them.

# Second issue - remove ivm

We want to remove isolated-vm in rudder-transformer, so we also need to answer:
* How do we achieve isolation between one transformation and another of the same tenant?
  * We might have multiple transformations of the same tenant/workspace running in the same pod/container.
  * In rudder-pytransformer we're using a `ProcessPool`, check that for inspiration but don't stop there, let me know if
    you have a better idea.
* How much effort would be needed to remove the `isolated-vm`? We need to give an estimation.
* How much effort to move away from Node.js and use bun instead.

# Footnotes

* Write your plan into `kata-plan.md`.
* Ask the openai-reviewer to review your plan and report its findings in the plan as well.