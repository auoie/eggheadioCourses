FROM node:16
WORKDIR /home/node/app
RUN apt-get update && apt-get install -y git make vim wget zsh
USER node
RUN sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
COPY docker/.zshrc /home/node/.zshrc
ENTRYPOINT ["/bin/bash", "-l", "-c"]
CMD ["/bin/zsh"]
