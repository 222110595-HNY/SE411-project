package edu.psu.se411.assetmanager.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import edu.psu.se411.assetmanager.exception.ObjectNotFoundException;
import edu.psu.se411.assetmanager.model.Asset;
import edu.psu.se411.assetmanager.repository.AssetRepository;

@Service
public class AssetService {

	private AssetRepository assetRepository;

	public AssetService(AssetRepository assetRepository) {
		this.assetRepository = assetRepository;
	}

	public Page<Asset> getAssets(Pageable pageable) {
		return assetRepository.findAll(pageable);
	}

	public Optional<Asset> getAssetById(Long id) {
		return assetRepository.findById(id);
	}

	public Asset createAsset(Asset asset) {
		return assetRepository.save(asset);
	}

	public void updateAsset(Long id, Asset asset) {
		assetRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Asset not found"));
		Asset updatedAsset = new Asset(id, asset.tag(), asset.type(), asset.brand(), asset.model(), asset.serial(),
				asset.assignedTo(), asset.status(), asset.purchaseDate(), asset.price());
		assetRepository.save(updatedAsset);
	}

	public void deleteAsset(Long id) {
		assetRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Asset not found"));
		assetRepository.deleteById(id);
	}

}
