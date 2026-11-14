package edu.psu.se411.assetmanager.controller;

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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.util.UriComponentsBuilder;

import edu.psu.se411.assetmanager.model.Asset;
import edu.psu.se411.assetmanager.service.AssetService;

@ExtendWith(MockitoExtension.class)
class AssetControllerTest {

	@Mock
	private AssetService assetService;

	@InjectMocks
	private AssetController assetController;

	private Asset asset = new Asset(1L, "PC-001", "Laptop", "Dell", "Latitude", "SER-1", "Sara", "In Use",
			LocalDate.of(2025, 2, 10), 4200.0);

	private Asset newAsset = new Asset(null, "PC-001", "Laptop", "Dell", "Latitude", "SER-1", "Sara", "In Use",
			LocalDate.of(2025, 2, 10), 4200.0);

	@Test
	void testGetAssets() {
		Pageable pageable = PageRequest.of(0, 3);
		when(assetService.getAssets(pageable)).thenReturn(new PageImpl<>(List.of(asset)));
		assertEquals(HttpStatus.OK, assetController.getAssets(pageable).getStatusCode());
	}

	@Test
	void testGetAssetById() {
		when(assetService.getAssetById(1L)).thenReturn(Optional.of(asset));
		assertEquals(HttpStatus.OK, assetController.getAssetById(1L).getStatusCode());
	}

	@Test
	void testCreateAsset() {
		when(assetService.createAsset(newAsset)).thenReturn(asset);
		assertEquals(HttpStatus.CREATED,
				assetController.createAsset(newAsset, UriComponentsBuilder.newInstance()).getStatusCode());
	}

	@Test
	void testUpdateAsset() {
		assertEquals(HttpStatus.NO_CONTENT, assetController.updateAsset(1L, newAsset).getStatusCode());
		verify(assetService).updateAsset(1L, newAsset);
	}

	@Test
	void testDeleteAsset() {
		assertEquals(HttpStatus.NO_CONTENT, assetController.deleteAsset(1L).getStatusCode());
		verify(assetService).deleteAsset(1L);
	}

}
