package edu.psu.se411.assetmanager.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import edu.psu.se411.assetmanager.model.Asset;
import edu.psu.se411.assetmanager.repository.AssetRepository;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

	@Mock
	private AssetRepository assetRepository;

	@InjectMocks
	private AssetService assetService;

	private Asset asset = new Asset(1L, "PC-001", "Laptop", "Dell", "Latitude", "SER-1", "Sara", "In Use",
			LocalDate.of(2025, 2, 10), 4200.0);

	@Test
	void testGetAssets() {
		Pageable pageable = PageRequest.of(0, 3);
		Page<Asset> page = new PageImpl<>(List.of(asset));
		when(assetRepository.findAll(pageable)).thenReturn(page);
		assertEquals(page, assetService.getAssets(pageable));
	}

	@Test
	void testGetAssetById() {
		when(assetRepository.findById(1L)).thenReturn(Optional.of(asset));
		assertEquals(asset, assetService.getAssetById(1L).get());
	}

	@Test
	void testCreateAsset() {
		when(assetRepository.save(asset)).thenReturn(asset);
		assertEquals(asset, assetService.createAsset(asset));
	}

	@Test
	void testUpdateAsset() {
		when(assetRepository.findById(1L)).thenReturn(Optional.of(asset));
		assetService.updateAsset(1L, asset);
		verify(assetRepository).save(asset);
	}

	@Test
	void testDeleteAsset() {
		when(assetRepository.findById(1L)).thenReturn(Optional.of(asset));
		assetService.deleteAsset(1L);
		verify(assetRepository).deleteById(1L);
	}

}
