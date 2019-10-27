# Modeling4Cloud
Bachelor degree thesis. Full stack application (MongoDB, Express.js, React.js, Node.js) for monitoring, analysis and representation of network delays of the main Cloud Providers.
## Abstract
Abstract link: https://ieeexplore.ieee.org/document/8187641

For many applications with inter-datacenter cloud deployments it is important to rely on an accurate model of delay times across different geolocations. Unfortunately, such a model is currently not available to researchers and practitioners.
 
From the perspective of practitioners and researchers, a key challenge and still open issue is how to realistically model inter-datacenter communication delays. In fact, latency between datacenters is subject to several (uncontrollable) factors, including its intrinsic higher variability - compared to intra-datacenter communications - and periodic readjustments/idiosyncrasies, such as variations of the data path due to network load balancing techniques. 

The proposed project was created to fill this gap, through an initial latency analysis that characterizes the connections between different data centers, placed in heterogeneous areas of the globe, for different service providers.
The intent is to create a system capable of obtaining the specified data, permanently save them, analyze and present them to the end user.

The Cloud Providers that are market leaders will be examined: Amazon Web Services, Google Cloud Platform, Microsoft Azure and IBM Cloud.
For each of them, Virtual Machines will be set up on different datacenter and a program for monitoring network delays will be started.
It will therefore be possible to make a comparison between the different suppliers and analyze their stability, in terms of latency between the different regions.

The models currently present do not allow us to have an overview of all providers and present a static scheme calculated on previous tests or hypotheses based on the position of a region.
With this project, a dynamic and constantly updated monitoring system of all possible combinations of data centers will be obtained, allowing to outline what are the connections that present a greater latency. The ultimate goal is to offer a single source of truth for the delays of inter-data center model network, for all Cloud Providers. The solution
allow, for example, to design the deployment of infrastructure components, moving them from one data center to another in the event of malfunctions or delays in communication between them.

## Architecture
It is possible to identify 5 different sectors, each with a specific competence:
- Cloud Provider: hosting Virtual Machines
- Probing: algorithm for data collection
- Persistence: data backup on database (MongoDB)
- Back-end: application business logic (Node.js, Express.js)
- Front-end: data presentation (React.js)

![Architecture](/images/README/architecture.png)

## Results
It's possible, for example, to display the average latency of a selected provider, for a selected month (example in the images above: responsive visualization of the Google Cloud Platform average latency between 2 host located in different regions, in the month of July 2018).

Choose the data             |  Output
:-------------------------:|:-------------------------:
![](/images/README/result2.jpg)  |  ![](/images/README/result1.jpg)
## More
See more in "Thesis.pdf" and "Presentazione.pdf" (in italian).
