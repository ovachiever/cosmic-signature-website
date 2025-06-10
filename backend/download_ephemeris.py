#!/usr/bin/env python3
"""
Download Swiss Ephemeris data files for accurate astronomical calculations.
"""

import os
import urllib.request
import zipfile
import shutil

def download_ephemeris_files():
    """Download the necessary ephemeris files from the Swiss Ephemeris website."""
    
    # Create ephe directory if it doesn't exist
    ephe_dir = os.path.join(os.path.dirname(__file__), 'ephe')
    if not os.path.exists(ephe_dir):
        os.makedirs(ephe_dir)
        print(f"Created ephemeris directory: {ephe_dir}")
    
    # List of essential ephemeris files to download
    # These cover the period from 1800 to 2400 AD
    files_to_download = [
        'semo_18.se1',  # Moon ephemeris
        'sepl_18.se1',  # Planet ephemeris  
        'seas_18.se1',  # Asteroid ephemeris (for Chiron, etc.)
    ]
    
    base_url = 'https://www.astro.com/ftp/swisseph/ephe/'
    
    for filename in files_to_download:
        file_path = os.path.join(ephe_dir, filename)
        
        # Check if file already exists
        if os.path.exists(file_path):
            print(f"File already exists: {filename}")
            continue
        
        # Download the file
        url = base_url + filename
        print(f"Downloading {filename}...")
        
        try:
            urllib.request.urlretrieve(url, file_path)
            print(f"Successfully downloaded: {filename}")
        except Exception as e:
            print(f"Error downloading {filename}: {e}")
            
            # Try alternative download method
            try:
                import requests
                response = requests.get(url)
                if response.status_code == 200:
                    with open(file_path, 'wb') as f:
                        f.write(response.content)
                    print(f"Successfully downloaded (alt method): {filename}")
                else:
                    print(f"Failed to download {filename}: HTTP {response.status_code}")
            except:
                print(f"Alternative download method also failed for {filename}")
    
    # Download the main ephemeris file package if individual files failed
    try:
        # Try to download the basic ephemeris package
        package_url = 'https://www.astro.com/ftp/swisseph/ephe/sweph_18.tar.gz'
        package_path = os.path.join(ephe_dir, 'sweph_18.tar.gz')
        
        if not os.path.exists(package_path):
            print("Attempting to download ephemeris package...")
            urllib.request.urlretrieve(package_url, package_path)
            
            # Extract the package
            import tarfile
            with tarfile.open(package_path, 'r:gz') as tar:
                tar.extractall(ephe_dir)
            print("Successfully extracted ephemeris package")
            
            # Clean up
            os.remove(package_path)
    except Exception as e:
        print(f"Could not download ephemeris package: {e}")
    
    print("\nEphemeris download complete!")
    print(f"Files are located in: {ephe_dir}")
    
    # List downloaded files
    if os.path.exists(ephe_dir):
        files = os.listdir(ephe_dir)
        if files:
            print("\nDownloaded files:")
            for f in files:
                print(f"  - {f}")
        else:
            print("\nWarning: No ephemeris files found. Using built-in calculations (less accurate)")

if __name__ == "__main__":
    download_ephemeris_files()
