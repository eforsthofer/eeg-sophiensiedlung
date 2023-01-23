package updater

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/evcc-io/evcc/server"
	"github.com/google/go-github/v32/github"
	"github.com/hashicorp/go-version"
)

const timeout = 30 * time.Second

// Repo is a github repository adapter
type Repo struct {
	owner, repository string
	*github.Client
}

// NewRepo creates repository adapter
func NewRepo(owner, repository string) *Repo {
	r := &Repo{
		owner:      owner,
		repository: repository,
		Client:     github.NewClient(nil),
	}
	return r
}

// GetLatestRelease gets latest of github releases
func (r *Repo) GetLatestRelease() (*github.RepositoryRelease, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	release, _, err := r.Repositories.GetLatestRelease(ctx, r.owner, r.repository)
	return release, err
}

// ReleaseNotes returns github release notes for the (from,to] semver interval
func (r *Repo) ReleaseNotes(from string) (rendered string, err error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var fromVersion *version.Version
	if fromVersion, err = version.NewVersion(from); err != nil {
		return
	}

	releases, _, err := r.Repositories.ListReleases(ctx, r.owner, r.repository, nil)
	if err != nil {
		return
	}

	history := bytes.NewBuffer([]byte{})
	for _, rel := range releases {
		tag := *rel.TagName

		var ver *version.Version
		if ver, err = version.NewVersion(tag); err != nil {
			return
		}

		if ver.LessThanOrEqual(fromVersion) {
			continue
		}

		if notes := strings.TrimSpace(rel.GetBody()); notes != "" {
			var md string
			if md, _, err = r.Markdown(context.Background(), notes, &github.MarkdownOptions{
				Mode:    "gfm",
				Context: fmt.Sprintf("%s/%s", server.Owner, server.Repository),
			}); err != nil {
				return
			}

			history.WriteString(fmt.Sprintf("<h1>%s</h1>\n", tag))
			history.WriteString(md)
		}
	}

	return history.String(), nil
}

// FindReleaseAsset finds asset by name and returns ID and size
func (r *Repo) FindReleaseAsset(name string) (int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	rel, _, err := r.Repositories.GetLatestRelease(ctx, r.owner, r.repository)
	if err != nil {
		return 0, 0, err
	}

	for _, a := range rel.Assets {
		if *a.Name == name {
			return *a.ID, *a.Size, nil
		}
	}

	return 0, 0, fmt.Errorf("asset not found: %s", name)
}

// StreamAsset provides a ReadCloser for streaming the assets over HTTP
func (r *Repo) StreamAsset(id int64) (io.ReadCloser, error) {
	rc, _, err := r.Repositories.DownloadReleaseAsset(context.Background(), r.owner, r.repository, id, http.DefaultClient)
	return rc, err
}
