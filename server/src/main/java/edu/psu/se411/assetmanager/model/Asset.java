package edu.psu.se411.assetmanager.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record Asset(
			@Id Long id,
			@NotBlank(message = "Tag cannot be empty")
			String tag,
			@NotBlank(message = "Type cannot be empty")
			String type,
			@NotBlank(message = "Brand cannot be empty")
			String brand,
			@NotBlank(message = "Model cannot be empty")
			String model,
			@NotBlank(message = "Serial cannot be empty")
			String serial,
			String assignedTo,
			@NotBlank(message = "Status cannot be empty")
			String status,
			@NotNull(message = "Purchase date is required")
			LocalDate purchaseDate,
			@NotNull(message = "Price is required")
			@PositiveOrZero(message = "Price cannot be negative")
			Double price
		) {}
