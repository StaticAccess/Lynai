# Taking a base image
FROM python:latest AS builder

# Creating a working directory
WORKDIR /app

# Copy code to the working directory
COPY . .

#======Stage-2=========

FROM python:3.10-slim
WORKDIR /app
COPY --from=builder /app .

# Set up and activate virtual environment, then install requirements
RUN pip install --upgrade pip && pip install -r requirement.txt

EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

