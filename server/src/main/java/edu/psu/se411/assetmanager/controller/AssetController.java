package edu.psu.se411.assetmanager.controller;

import java.net.URI;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import edu.psu.se411.assetmanager.exception.ObjectNotFoundException;
import edu.psu.se411.assetmanager.model.Asset;
import edu.psu.se411.assetmanager.service.AssetService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/v1/assets")
public class AssetController {

	private AssetService assetService;

	public AssetController(AssetService assetService) {
		this.assetService = assetService;
	}

	@GetMapping()
	public ResponseEntity<PagedModel<Asset>> getAssets(Pageable pageable) {
		return ResponseEntity.ok(new PagedModel<>(assetService.getAssets(pageable)));
	}

	@GetMapping("/{id}")
	public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
		Optional<Asset> op = assetService.getAssetById(id);
		if (op.isPresent()) {
			return ResponseEntity.ok(op.get());
		}
		return ResponseEntity.notFound().build();
	}

	@PostMapping()
	public ResponseEntity<Void> createAsset(@Valid @RequestBody Asset asset, UriComponentsBuilder ucb) {
		if (asset.id() != null) {
			return ResponseEntity.badRequest().build();
		}
		Asset createdAsset = assetService.createAsset(asset);
		URI uri = ucb.path("/api/v1/assets/{id}").buildAndExpand(createdAsset.id()).toUri();
		return ResponseEntity.created(uri).build();
	}

	@PutMapping("/{id}")
	public ResponseEntity<Void> updateAsset(@PathVariable @Positive Long id, @Valid @RequestBody Asset asset) {
		if (asset.id() != null) {
			return ResponseEntity.badRequest().build();
		}
		try {
			assetService.updateAsset(id, asset);
			return ResponseEntity.noContent().build();
		} catch (ObjectNotFoundException e) {
			return ResponseEntity.notFound().build();
		}

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
		try {
			assetService.deleteAsset(id);
			return ResponseEntity.noContent().build();
		} catch (ObjectNotFoundException e) {
			return ResponseEntity.notFound().build();
		}

	}

}
