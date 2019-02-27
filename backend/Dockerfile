FROM node:carbon

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5555

CMD ["npm", "start"]

# General
# docker build -t albertobagnacani/m4c .
# docker run -d albertobagnacani/m4c
# docker exec -it <container-id> /bin/bash

# Docker Hub
# docker push albertobagnacani/m4c

# Google Container Registry
# docker tag albertobagnacani/m4c gcr.io/tesi-199213/m4c
# docker push gcr.io/tesi-199213/m4c

# IBM Image Registry
# docker tag albertobagnacani/m4c registry.au-syd.bluemix.net/modeling/m4c
# docker push registry.au-syd.bluemix.net/modeling/m4c

# old docker run -p 5555:5555 -d albertobagnacani/m4c