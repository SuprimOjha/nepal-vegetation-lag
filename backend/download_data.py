import earthaccess
import xarray as xr

# Authenticate
auth = earthaccess.login(strategy="interactive", persist=True)

# Search GPM data
gpm_results = earthaccess.search_data(
    short_name="GPM_3IMERGM",
    bounding_box=(80.0, 26.3, 88.3, 30.5),
    temporal=("2020-01-01", "2020-12-31")
)

print(f"Found {len(gpm_results)} granules.")

# Open files virtually using earthaccess open API (handles tokens seamlessly)
files = earthaccess.open(gpm_results[:3])
print("Successfully authenticated stream handles for:", files)