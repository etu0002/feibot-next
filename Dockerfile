FROM oven/bun:1

ENV USER=bot

# install python and make
# RUN apt-get update && \
#     apt-get install -y python3 build-essential && \
#     apt-get purge -y --auto-remove

# create bot user
RUN groupadd -r ${USER} && \
    useradd --create-home --home /home/evobot -r -g ${USER} ${USER}

# set up volume and user
USER ${USER}
WORKDIR /home/bot

COPY --chown=${USER}:${USER} bun.lockb ./
COPY --chown=${USER}:${USER} package.json ./
RUN bun install
# VOLUME [ "/home/bot" ]

COPY --chown=${USER}:${USER}  . .

ENTRYPOINT [ "bun", "run", "start" ]