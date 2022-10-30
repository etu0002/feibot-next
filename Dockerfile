FROM node:16.14

ENV USER=bot

# install python and make
RUN apt-get update && \
    apt-get install -y python3 build-essential && \
    apt-get purge -y --auto-remove

# create bot user
RUN groupadd -r ${USER} && \
    useradd --create-home --home /home/evobot -r -g ${USER} ${USER}

# set up volume and user
USER ${USER}
WORKDIR /home/bot

COPY --chown=${USER}:${USER} package*.json ./
COPY --chown=${USER}:${USER} package.json ./
RUN npm ci
# VOLUME [ "/home/bot" ]

COPY --chown=${USER}:${USER}  . .

ENTRYPOINT [ "npm", "start" ]