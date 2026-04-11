FROM pytorch/pytorch:2.2.1-cuda12.1-cudnn8-runtime

WORKDIR /models

RUN apt-get update && apt-get install -y \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Core ML Libraries for Pillars
RUN pip install --no-cache-dir \
    transformers \
    diffusers \
    dowhy \
    causal-learn \
    causalml \
    geopandas \
    movingpandas \
    scikit-mobility \
    networkx \
    wandb

CMD ["tail", "-f", "/dev/null"]
